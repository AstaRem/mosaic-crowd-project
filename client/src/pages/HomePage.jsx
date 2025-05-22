import StoryList from '../components/StoryList';
import Hero from '../components/Hero';
import './HomePage.css';

export default function HomePage({ user }) {
  return (
    <>
      <Hero />
      <div className="invite-to-login-container">
        {!user && <p className="alert">Please log in to post or donate</p>}
        <StoryList user={user} />
      </div>
    </>
  );
}
