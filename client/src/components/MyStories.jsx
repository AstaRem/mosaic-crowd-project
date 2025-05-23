import React, { useEffect, useState } from 'react';
import { fetchMyStories } from '../services/storyService.js';
import './MyStories.css';

export default function MyStories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchMyStories().then(setStories);
  }, []);

  if (!stories.length) return <p>You haven’t submitted any stories yet.</p>;

  // Partition into pending and fully funded stories
  const pendingStories = stories.filter(
    story => Number(story.collected_amount) < Number(story.target_amount)
  );
  const fundedStories = stories.filter(
    story => Number(story.collected_amount) >= Number(story.target_amount)
  );

  const renderDonations = (s) => (
    s.donations && s.donations.length > 0 && (
      <div className="donation-details">
        <h4>Donations:</h4>
        <ul>
          {s.donations.map((don, index) => (
            <li key={index}>
              {don.donor_name}: {Number(don.amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </li>
          ))}
        </ul>
      </div>
    )
  );

  return (
    <div className="my-stories-container">
      <h2>My Stories</h2>
      {pendingStories.length > 0 && (
        <ul className="my-stories-list">
          {pendingStories.map(s => (
            <li key={s.id} className="my-stories-card">
              <div className="image-container">
                {s.image_url && (
                  <img src={s.image_url} alt="Story cover" className="story-image" />
                )}
              </div>
              <div className="details">
                <h3>{s.title}</h3>
                <p><strong>Status: {s.status}</strong></p>
                <p>
                  <strong>Raised:</strong>&nbsp;&nbsp;
                  {Number(s.collected_amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                  &nbsp;out of&nbsp;
                  {Number(s.target_amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p>{s.description}</p>
                {renderDonations(s)}
              </div>
            </li>
          ))}
        </ul>
      )}
      {fundedStories.length > 0 && (
        <>
          <h2 className="completed-header">Completed Campaigns</h2>
          <ul className="my-stories-list">
            {fundedStories.map(s => (
              <li key={s.id} className="my-stories-card">
                <div className="image-container">
                  {s.image_url && (
                    <img src={s.image_url} alt="Story cover" className="story-image" />
                  )}
                </div>
                <div className="details">
                  <h3>{s.title}</h3>
                  <p><strong>Status: {s.status}</strong></p>
                  <p>
                    <strong>Raised:</strong>&nbsp;&nbsp;
                    {Number(s.collected_amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                    &nbsp;out of&nbsp;
                    {Number(s.target_amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <strong className="goal-marker">🎉 Goal reached!</strong>
                  {renderDonations(s)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}