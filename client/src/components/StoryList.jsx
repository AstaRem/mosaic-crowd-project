import React, { useEffect, useState } from 'react';
import { fetchStories, donateToStory } from '../services/storyService.js';
import DonationForm from './DonationForm.jsx';

export default function StoryList({ user }) {
  const [stories, setStories] = useState([]);
  // console.log(stories)

  const load = async () => {
    const data = await fetchStories();
    console.log('fetched stories:', data);
    setStories(data);
  };

  useEffect(() => {
    load();
  }, []);
  if (!stories.length) return <p>No campaigns yet.</p>;

  const handleDonate = async ({ storyId, donorName, amount }) => {
    await donateToStory(storyId, { donorName, amount });
    // reload stories to get updated collected_amount
    await load();

  };

  return (
    <ul>
       
      {stories.map(story => {
        console.log('story data: ', story.collected_amount, story.target_amount, story.author_name)
        return (

          <li key={story.id}>
            <h3>{story.title}</h3>
            <p>By: {story.author_name}</p>
            <p>{story.description}</p>

            <p>
              Raised:&nbsp;
              {Number(story.collected_amount).toLocaleString("en-US", {
                style: "currency",
                currency: "EUR",
              })}&nbsp;
              out of a&nbsp;
              {Number(story.target_amount).toLocaleString("en-US", {
                style: "currency",
                currency: "EUR",
              })}&nbsp;
              target.
            </p>

            {/* Disable donate if goal reached */}

            {Number(story.collected_amount) < Number(story.target_amount) && user && user.id !== story.author_id &&
              <DonationForm storyId={story.id} onSuccess={handleDonate} />
            }
            {Number(story.collected_amount) < Number(story.target_amount) && user && user.id === story.author_id &&
              <p style={{ fontStyle: 'italic' }}>
                You cannot donate to your own story.
              </p>
            }
            {Number(story.collected_amount) >= Number(story.target_amount) &&
              <strong>🎉 Goal reached!</strong>
            }
          </li>
        )
      }
      )}
    </ul>
  );
}