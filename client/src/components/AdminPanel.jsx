import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [stories, setStories] = useState([]);

  const load = async () => {
    const res = await axios.get('/api/admin/stories?status=pending');
    setStories(res.data.stories);
  };

  useEffect(() => { load() }, []);

  const handleAction = async (id, action) => {
    const url =
      action === 'approve'
        ? `/api/admin/stories/${id}/approve`
        : `/api/admin/stories/${id}`;
    await (action === 'approve'
      ? axios.post(url)
      : axios.delete(url));
    load();
  };

  return (
    <div>
      <h1>Pending Stories</h1>
      {stories.length === 0 && <p>No pending stories.</p>}
      {stories.map(s => (
        <div key={s.id} style={{ margin: 12, padding: 12, border: '1px solid #ccc' }}>
          <h2>{s.title}</h2>
          <p>By: {s.author_name}</p>
          <p>{s.description}</p>
          <p>Raised: ${s.collected_amount.toFixed(2)}</p>
          <button onClick={() => handleAction(s.id, 'approve')}>
            Approve
          </button>
          <button
            onClick={() => handleAction(s.id, 'reject')}
            style={{ marginLeft: 8, color: 'red' }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
