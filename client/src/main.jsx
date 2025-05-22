import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';


axios.defaults.baseURL = 'http://localhost:5000';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
