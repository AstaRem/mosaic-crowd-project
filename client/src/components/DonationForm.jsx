import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DonationForm({ storyId, onSuccess }) {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount]       = useState('');
  const [error, setError]         = useState('');
  const [confirmation, setConfirmation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    try {
      await onSuccess({ storyId, donorName, amount: Number(amount) });
       setConfirmation(`Thank you for your donation of €${Number(amount).toFixed(2)}! We appreciate your support.`);
      setDonorName('');
      setAmount('');
      setError('');
    } catch {
      setError('Donation failed');
    }
  };

   if (confirmation) {
    return (
      <div style={{ marginTop: 8 }}>
        <p>{confirmation}</p>
        {/* <button onClick={() => navigate('/')}>Home</button> */}
        <button onClick={() => navigate('/my-stories')} style={{ marginLeft: 8 }}>
          My Stories
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
      <input
        placeholder="Your Name"
        value={donorName}
        onChange={e => setDonorName(e.target.value)}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        style={{ marginLeft: 4 }}
      />
      <button type="submit" style={{ marginLeft: 4 }}>
        Donate
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
