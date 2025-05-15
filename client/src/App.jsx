import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import './App.css';
import StoryList from './components/StoryList';
import StoryForm from './components/StoryForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import AdminPanel from './pages/AdminPanel';
import { useState } from 'react';
import MyStories from './pages/MyStories';
import heroImg from './assets/hero.png';
import logoImg from './assets/logo-img.png';


function App() {
  // Store the logged-in user's info
  const [user, setUser] = useState(null);

  // Handle login callback
  const handleLogin = (data) => {
    setUser({ id: data.id, role: data.role, name: data.name });
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Guarded route for authenticated access
  const RequireAuth = ({ children }) =>
    user ? (
      children
    ) : (
      <Navigate to="/login" replace />
    );

  // Guarded route for admin access
  const RequireAdmin = ({ children }) =>
    user?.role === 'admin' ? (
      children
    ) : (
      <Navigate to="/" replace />
    );

  return (
    <BrowserRouter>
      <header>
        <div className="logo">
          <div className="logo-img-container">
            <img src={logoImg} />
          </div>
          <div className="logo-text">
            <span className="logo-one logo-name">Mosaic</span> <br />
            <span className="logo-two logo-name">Crowd</span>
          </div>
        </div>


        <div>

          {/* Top navigation menu */}
          <nav style={{ marginTop: 8 }}>
            <NavLink to="/" style={{ marginRight: 12 }}  >
              Home
            </NavLink>
            {
              user && (
                <NavLink to='/my-stories' style={{ marginRight: 12 }} >
                  My stories
                </NavLink>

              )
            }

            {!user && (
              <>
                <NavLink to="/register" style={{ marginRight: 12 }}  >
                  Register
                </NavLink>
                <NavLink to="/login" style={{ marginRight: 12 }}  >
                  Login
                </NavLink>
              </>
            )}
            {user && (
              <>
                <NavLink to="/submit" style={{ marginRight: 12 }}  >
                  Submit Story
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" style={{ marginRight: 12 }}  >
                    Admin Panel
                  </NavLink>
                )}
              </>
            )}
          </nav>
        </div>
      </header>


      <img src={heroImg} alt="hero image people with mosaic" />



      <h1>
        Join Mosaic Crowd — share your story to raise funds or support causes you believe in.
      </h1>

      {!user && (
        <span style={{ display: 'block', marginTop: 8, fontSize: '0.8em', color: 'red' }}>
          Please log in to post or donate.
        </span>
      )}





      <div className="App" style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>



          <div>
            {user
              ? (
                <>
                  <span style={{ marginRight: 12 }}>Hello, {user.name}</span>
                  <button onClick={handleLogout}>Logout</button>

                </>
              )
              : null}
          </div>
        </header>

        <main>
          <Routes>
            {/* Home: list of stories */}
            <Route path="/" element={<StoryList user={user} />} />

            {/* Registration & Login */}
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />

            {/* show the own user stories */}
            <Route
              path="/my-stories"
              element={
                <RequireAuth>
                  <MyStories />
                </RequireAuth>
              }
            />

            {/* Submit story (authenticated) */}
            <Route
              path="/submit"
              element={
                <RequireAuth>
                  <StoryForm authorId={user?.id} />
                </RequireAuth>
              }
            />

            {/* Admin panel (admin only) */}
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <AdminPanel />
                  </RequireAdmin>
                </RequireAuth>
              }
            />

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </main>
      </div>
      <div className="colors">
        <div className="color1">background</div>
        <div className="color2">background-darker</div>
        <div className="color3">dark</div>
        <div className="color4">medium</div>
        <div className="color5">lighter</div>
        <div className="color6">contrasting</div>
      </div>

    </BrowserRouter>

  );
}

export default App;
