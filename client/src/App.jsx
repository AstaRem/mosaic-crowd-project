import './App.css'
import StoryList from './components/StoryList';
import StoryForm from './components/StoryForm';

function App() {
  // For now we’ll hard-code authorId=1; later this will come from my auth context
  const authorId = 1;

  return (
    <div className="App" style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Crowdfunding Platform</h1>
      
      <section style={{ marginBottom: 40 }}>
        <h2>Submit a New Story</h2>
        <StoryForm authorId={authorId} />
      </section>

      <section>
        <h2>Active Campaigns</h2>
        <StoryList />
      </section>
    </div>
  );
}

export default App;