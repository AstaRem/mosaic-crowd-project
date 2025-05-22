import React from 'react';
import StoryForm from '../components/StoryForm';
import './SubmitPage.css';

export default function SubmitPage({ authorId }) {
  return (
    <div className="container">
      <StoryForm authorId={authorId} />
    </div>
  );
}
