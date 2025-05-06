import React, { useEffect, useState } from 'react';
import { fetchStories } from '../services/storyService.js';

export default function StoryList() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchStories()
      .then(data => setStories(data))
      .catch(err => console.error('Error loading stories', err));
  }, []);

  if (!stories.length) return <p>No campaigns yet.</p>;

  return (
    <ul>
      {stories.map(s => (
        <li key={s.id}>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <p>
            Raised: ${s.collectedAmount} / ${s.targetAmount}
          </p>
        </li>
      ))}
    </ul>
  );
}