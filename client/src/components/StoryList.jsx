import React, { useEffect, useState } from 'react';
import { fetchStories, donateToStory } from '../services/storyService.js';
import DonationForm from './DonationForm.jsx';
import axios from 'axios';
import './StoryList.css';

export default function StoryList({ user }) {
  const [stories, setStories] = useState([]);

  const load = async () => {
    const data = await fetchStories();
    setStories(data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!stories.length) return <p>No campaigns yet.</p>;

  // Split stories into pending (not fully funded) and fully funded arrays.
  const pendingStories = stories.filter(
    story => Number(story.collected_amount) < Number(story.target_amount)
  );
  const fundedStories = stories.filter(
    story => Number(story.collected_amount) >= Number(story.target_amount)
  );

  const handleDonate = async ({ storyId, donorName, amount }) => {
    await donateToStory(storyId, { donorName, amount });
    // reload stories to get updated collected_amount
    await load();
  };

  const handleHide = async (id) => {
    if (window.confirm('Are you sure you want to hide this campaign?')) {
      await axios.post(`/api/admin/stories/${id}/hide`);
      load();
    }
  };

  const renderAdminHideButton = (story) => {
    if (user && user.role === 'admin') {
      return (
        <button
          className="hide"
          onClick={() => handleHide(story.id)}
        >
          Hide Campaign
        </button>
      );
    }
    return null;
  };

  return (
    <ul className="story-list">
      {pendingStories.map(story => (
        <li className="story-card" key={story.id}>
          <div className="image-container">
            {story.image_url && (
              <img
                src={story.image_url}
                alt="Story cover"
                className="story-image"
              />
            )}
          </div>
          <div className="details">
            <h3>{story.title}</h3>
            <p>By: {story.author_name}</p>
            <p>{story.description}</p>
            <p className="raised">
              <strong>Raised:</strong>&nbsp;&nbsp;
              {Number(story.collected_amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}&nbsp;
              out of&nbsp;
              {Number(story.target_amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
            {Number(story.collected_amount) < Number(story.target_amount) &&
              user &&
              user.id !== story.author_id && (
                <DonationForm
                  storyId={story.id}
                  onSuccess={handleDonate}
                  maxDonation={Number(story.target_amount) - Number(story.collected_amount)}
                />
              )}
            {Number(story.collected_amount) < Number(story.target_amount) &&
              user &&
              user.id === story.author_id && (
                <p style={{ fontStyle: "italic" }}>
                  You cannot donate to your own story.
                </p>
              )}
            {/* Only show hide button if the logged-in user is admin */}
            {renderAdminHideButton(story)}
          </div>
        </li>
      ))}
      {fundedStories.length > 0 && (
        <>
          <h2>Completed Campaigns 🎉</h2>
          {fundedStories.map(story => (
            <li className="story-card" key={story.id}>
              <div className="image-container">
                {story.image_url && (
                  <img
                    src={story.image_url}
                    alt="Story cover"
                    className="story-image"
                  />
                )}
              </div>
              <div className="details">
                <h3>{story.title}</h3>
                <p>By: {story.author_name}</p>
                <p>{story.description}</p>
                <p>
                  Raised:&nbsp;
                  {Number(story.collected_amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}&nbsp;
                  out of&nbsp;
                  {Number(story.target_amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <strong className="goal-reached">🎉 Goal reached!</strong>
                {/* Add admin hide button here as well */}
                {renderAdminHideButton(story)}
              </div>
            </li>
          ))}
        </>
      )}
    </ul>
  );
}
