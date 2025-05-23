import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationForm.css';

export default function DonationForm({ storyId, onSuccess, maxDonation }) {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationValue = Number(amount);
    if (!donationValue || isNaN(donationValue) || donationValue <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (donationValue > maxDonation) {
      setError(`Donation cannot exceed $${maxDonation.toFixed(2)}`);
      return;
    }
    try {
      await onSuccess({ storyId, donorName, amount: donationValue });
      setConfirmation(
        `Thank you for your donation of $${donationValue.toFixed(2)}! We appreciate your support.`
      );
      setDonorName('');
      setAmount('');
      setError('');
    } catch {
      setError('Donation failed');
    }
  };


  return (
<>
{confirmation && <p><strong>{confirmation}</strong></p>}
    <form onSubmit={handleSubmit} className="donation-form">
      <input
        placeholder="Your Name"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        max={maxDonation}
      />
      <button type="submit">Donate</button>
      {error && <p>{error}</p>}
    </form>

</>
  );
}