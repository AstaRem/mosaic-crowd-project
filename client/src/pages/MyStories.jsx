import { useEffect, useState } from 'react';
import { fetchMyStories } from '../services/storyService.js';

export default function MyStories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchMyStories().then(setStories);
  }, []);

  if (!stories.length) 
    return <p>You haven’t submitted any stories yet.</p>;

  return (
    <div>
      <h2>My Stories</h2>
      {stories.map(s => (
        <div key={s.id} style={{ border: '1px solid #ccc', padding: 12, margin: 12 }}>
          <h3>{s.title}</h3>
          <p>Status: <strong>{s.status}</strong></p>
          <p>Raised: ${s.collected_amount.toFixed(2)} / ${s.target_amount.toFixed(2)}</p>
          <p>{s.description}</p>
        </div>
      ))}
    </div>
  );
}
