import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

export default function AdminPanel() {
  const [stories, setStories] = useState([]);

  const load = async () => {
    // Fetch pending stories; adjust endpoint as needed if you want to list all non-hidden stories.
    const res = await axios.get('/api/admin/stories?status=pending');
    setStories(res.data.stories);
  };

  useEffect(() => { load(); }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this story?')) {
      await axios.delete(`/api/admin/stories/${id}/delete`);
      load();
    }
  };

  // New handler to hide a campaign.
  const handleHide = async (id) => {
    if (window.confirm('Are you sure you want to hide this campaign?')) {
      await axios.post(`/api/admin/stories/${id}/hide`);
      load();
    }
  };

  return (
    <div className="admin-panel">
      <h1>Pending Stories</h1>
      {stories.length === 0 && <p>No pending stories.</p>}
      {stories.map(s => (
        <li className="admin-story-card" key={s.id}>
          <div className="image-container">
            {s.image_url && (
              <img
                src={s.image_url}
                alt="Story cover"
                className="story-image"
              />
            )}
          </div>
          <div className="details">
            <h2>{s.title}</h2>
            <p>By: {s.author_name}</p>
            <p>{s.description}</p>
            <p>Raised: ${s.collected_amount.toFixed(2)}</p>
            <div className="button-group">
              <button 
                className="approve"
                onClick={() => handleAction(s.id, 'approve')}
              >
                Approve
              </button>
              <button
                className="reject"
                onClick={() => handleAction(s.id, 'reject')}
              >
                Reject
              </button>
              <button
                className="hide"
                onClick={() => handleHide(s.id)}
              >
                Hide Campaign
              </button>
              <button
                className="delete"
                onClick={() => handleDelete(s.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </div>
  );
}