import axios from 'axios';

// Fetch all approved stories
export function fetchStories() {
  return axios.get('/api/stories')
    .then(res => res.data.stories ?? []);
}

// Submit a new story
export function submitStory(storyData) {
  return axios.post('/api/stories', storyData)
    .then(res => res.data);
}