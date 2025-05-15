import axios from 'axios';


// Add an interceptor to include the Authorization header for every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch all approved stories
export async function fetchStories() {
  const res = await axios.get('/api/stories');
  console.log('fetched stories in story service:',res.data.stories)
  return res.data.stories ?? [];
}

// Submit a new story
export async function submitStory(storyData) {
  const res = await axios.post('/api/stories', storyData);
  return res.data;
}

// Donate to a story
export async function donateToStory(storyId, { donorName, amount }) {
  const res = await axios.post(`/api/stories/${storyId}/donate`, {
    donorName,
    amount
  });
  return res.data;
}

//get the own user stories
// …
export async function fetchMyStories() {
  const res = await axios.get('/api/my-stories');
  return res.data.stories ?? [];
}
