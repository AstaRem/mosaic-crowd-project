
# Mosaic Crowd - full-stack crowdfunding project

# Data Flow Overview for Mosaic Crowd

## 1. Client-Side Application

### Architecture

The client is built with React and managed with Vite. The code is organized into pages (in `pages`), components (in `components`), layouts (in `layouts`), and services (in `services`).

### User Authentication

#### Registration

A new user fills out the form in `RegisterForm.jsx`, which sends a `POST` request (using Axios) to the backend endpoint `/api/register` (handled in `server/server.js`). If registration is successful, a success message is returned and the UI informs the user.

#### Login

The `LoginForm.jsx` component collects credentials and makes a `POST` request to `/api/login`. On success, a JWT is returned, stored in `localStorage`, and the global state is updated. An Axios interceptor, defined in `storyService.js`, appends the token to all outgoing requests.

### Story Submission and Donation

#### Submitting a New Story

Users submit a story using the `StoryForm.jsx` component. This form gathers title, description, image file, and target funding amount. It sends a `multipart/form-data` request via the `submitStory` function in `storyService.js` to the backend endpoint `/api/stories`. The server stores the story in the database and handles the image upload using multer.

#### Donating to a Story

The `DonationForm.jsx` component handles donations. When a user donates, the component calls the `donateToStory` function (again in `client/src/services/storyService.js`) which triggers a `POST` request to `/api/stories/:id/donate`. Following a successful donation, the UI shows a confirmation message while the form remains visible until the funding target is reached.

### Displaying Stories

The `StoryList.jsx` component requests approved stories from `/api/stories` and displays them. It divides stories into pending and fully funded categories based on the funding status. Similarly, the `MyStories.jsx` component displays the authenticated user’s own stories.

### Admin Panel

For administrators, the `AdminPanel.jsx` component shows pending (or non-hidden) stories. Admins can approve, reject, delete, or hide stories by sending appropriate requests to dedicated endpoints defined on the server.

## 2. Server-Side Application

### Express API

The server is built with Express (see `server/server.js`) and connects to a MySQL database. It provides RESTful endpoints for:

#### User Registration & Login

Endpoints like `/api/register` and `/api/login` handle user creation and authentication. Passwords are hashed with bcrypt, and JWT tokens are generated for authentication.

#### Stories & Donations

Endpoints for story submission (`POST /api/stories`), fetching stories (`GET /api/stories` and `GET /api/my-stories`), and donating (`POST /api/stories/:id/donate`) implement the core crowdfunding functionality.

#### Admin Endpoints

Additional endpoints (`/api/admin/stories`, `/api/admin/stories/:id/approve`, `/api/admin/stories/:id/hide`, `/api/admin/stories/:id/delete`) let administrators manage the campaign lifecycle.

### Middleware

Several middleware functions are used:

#### CORS and JSON Parsing

The server uses CORS (allowing requests from the client on port 5173) and `express.json()` to parse incoming JSON.

#### JWT Authentication

A custom `authenticateToken` middleware validates JWT tokens in the `Authorization` header.

#### File Uploads

Multer is used to handle file uploads (images for stories), saving files in the `server/src/uploads/` directory.

### Database

The MySQL connection is managed in `server.js`, and SQL queries are executed using the `mysql2` library. Data such as users, stories, and donations are stored in the crowdfunding database.

## 3. Summary

The client (React + Vite) provides the UI and handles interactions like registration, login, story submission, and donation.
The server (Express) exposes RESTful endpoints that interact with a MySQL database and handle authentication, file uploads, and administrative actions.
Axios in the client and defined services (in services) are used for robust communication between the client and the server.

## Technologies Used

- **Client-Side**  
  - **React** – for building the user interface  
  - **Vite** – for fast development and build tooling  
  - **Axios** – for making HTTP requests  
  - **CSS** – for styling components (with custom variables)

- **Server-Side**  
  - **Node.js** with **Express** – for creating a RESTful API  
  - **MySQL** – for the database, managed via phpMyAdmin. SQL queries excecuted from Node.js 
  - **JWT (jsonwebtoken)** – for authentication  
  - **bcryptjs** – for password hashing  
  - **Multer** – for file uploads

- **Tooling & Utilities**  
  - **Nodemon** – for auto-restarting the server on code changes  
  - **ESLint** – for code linting and ensuring code quality  
