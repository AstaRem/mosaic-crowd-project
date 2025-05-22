import { NavLink } from 'react-router-dom';
import logoImg from '../assets/logo-img.png';
import './Header.css';

export default function Header({ user, onLogout }) {
  return (
    <header className="header">

      <div className="logo">
        
        <div className="logo-img-container">
          <img src={logoImg} alt="Mosaic Crowd Logo" />
      </div>

        <div className="logo-text">
          <div className="logo-one logo-name">Mosaic</div>
          <div className="logo-two logo-name">Crowd</div>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>

        {user && (
          <>
            <NavLink to="/my-stories" className="nav-link">
              My Stories
            </NavLink>
            <NavLink to="/submit" className="nav-link">
              Submit Story
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className="nav-link">
                Admin Panel
              </NavLink>
            )}
          </>
        )}

        {!user && (
          <>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
          </>
        )}

        {user && (
          <div className="user-controls">
            <span className="welcome">Welcome, {user.name}!</span>
            <button className="btn btn--cancel logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
