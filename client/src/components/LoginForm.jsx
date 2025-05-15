import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { email, password });
      // Save token in localStorage
      localStorage.setItem('token', res.data.token);
      setMessage(`Logged in as ${res.data.name}`);
      if (onLogin) {
        onLogin(res.data);
        navigate('/my-stories');
      }

    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Error logging in');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
}