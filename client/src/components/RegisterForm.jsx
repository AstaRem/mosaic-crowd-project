import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterForm.css';

export default function RegisterForm() {

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author'
  });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', user);
      setMessage(`User registered successfully!`);
      navigate('/');
    } catch (err) {
      console.error('Error registering user:', err);
      setMessage('Error registering user');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        name="name"
        placeholder="Name"
        value={user.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={user.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={user.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}