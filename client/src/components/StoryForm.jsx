import React, { useState } from 'react';
import { submitStory } from '../services/storyService.js';
import { NavLink, useNavigate } from 'react-router-dom';
import './StoryForm.css';

export default function StoryForm({ authorId }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    target_amount: '',
    image: null
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();


 function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }


  function handleFileChange(e) {
  const file = e.target.files[0];
  setForm({ ...form, image: file });
}

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   const payload = {
  //     ...form,
  //     target_amount: parseFloat(form.target_amount),
  //     author_id: authorId
  //   };
  //   submitStory(payload)
  //     .then(res => {
  //       setMessage(`Your story has been submitted and is awaiting approval`);
  //       setSubmitted(true);
  //     } )

  //     .catch(err => {
  //       console.error(err);
  //       setMessage('Error submitting story');
  //     });
  // }

  function handleSubmit(e) {
  e.preventDefault();
  const data = new FormData();
  data.append('title', form.title);
  data.append('description', form.description);
  data.append('target_amount', parseFloat(form.target_amount));
  data.append('author_id', authorId);
  if (form.image) {
    data.append('image', form.image);
  }

  submitStory(data)
    .then(res => {
      setMessage(`Your story has been submitted and is awaiting approval`);
      setSubmitted(true);
    })
    .catch(err => {
      console.error(err);
      setMessage('Error submitting story');
    });
}

          // 2 render modes: before & after submit
  if (submitted) {
    return (
    <div className="submission-confirmation">
      <p className="confirmation-message">{message}</p>
      <div className="confirmation-buttons">
        <button onClick={() => navigate('/my-stories')}>View My Stories</button>
        <button onClick={() => navigate('/')}>View All Stories</button>
      </div>
    </div>
  );
  }



  return (
    <form onSubmit={handleSubmit} className="story-form">
      <input
        name="title" placeholder="Title"
        value={form.title} onChange={handleChange} required
      />
      <textarea
        name="description" placeholder="Description"
        value={form.description} onChange={handleChange} required
      />
      <input
        name="image" placeholder="Upload the image"
        type="file"
        accept="image/"
        onChange={handleFileChange}
      />
      <input
        name="target_amount" placeholder="Target amount"
        type="number" step="0.01"
        value={form.target_amount} onChange={handleChange} required
      />
      <span>$</span>
      <button type="submit">Submit Story</button>
      {message && <p>{message}</p>}
    </form>
  );
}