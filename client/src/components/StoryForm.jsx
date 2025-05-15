import React, { useState } from 'react';
import { submitStory } from '../services/storyService.js';
import { NavLink, useNavigate } from 'react-router-dom';

export default function StoryForm({ authorId }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    target_amount: ''
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      target_amount: parseFloat(form.target_amount),
      author_id: authorId
    };
    submitStory(payload)
      .then(res => {
        setMessage(`Your story has been submitted and is awaiting approval`);
        setSubmitted(true);
      } )

      .catch(err => {
        console.error(err);
        setMessage('Error submitting story');
      });
  }

          // 2 render modes: before & after submit
  if (submitted) {
    return (
      <div>
        <p>{message}</p>
        {/* Two options: go to my stories or home */}
        <button onClick={() => navigate('/my-stories')} style={{ marginRight: 8 }}>
          View My Stories
        </button>
        <button onClick={() => navigate('/')}>
          View All Stories
        </button>
      </div>
    );
  }



  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title" placeholder="Title"
        value={form.title} onChange={handleChange} required
      />
      <textarea
        name="description" placeholder="Description"
        value={form.description} onChange={handleChange} required
      />
      <input
        name="image_url" placeholder="Image URL"
        value={form.image_url} onChange={handleChange}
      />
      <input
        name="target_amount" placeholder="Target amount"
        type="number" step="0.01"
        value={form.target_amount} onChange={handleChange} required
      />
      <span style={{ marginLeft: 4 }}>€</span>
      <button type="submit">Submit Story</button>
      {message && <p>{message}</p>}
    </form>
  );
}