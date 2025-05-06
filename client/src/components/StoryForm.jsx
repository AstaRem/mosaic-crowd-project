import React, { useState } from 'react';
import { submitStory } from '../services/storyService.js';

export default function StoryForm({ authorId }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    target_amount: ''
  });
  const [message, setMessage] = useState('');

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
      .then(res => setMessage(`Story submitted! ID: ${res.id}`))
      .catch(err => {
        console.error(err);
        setMessage('Error submitting story');
      });
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
      <button type="submit">Submit Story</button>
      {message && <p>{message}</p>}
    </form>
  );
}