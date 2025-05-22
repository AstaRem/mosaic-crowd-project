// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MainLayout.css';

export default function MainLayout({ user, onLogout }) {
  return (
    <div>
          <Header user={user} onLogout={onLogout} />

              <div className="main-layout wrapper">
      {/* THIS is where my pages render */}
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>

          <Footer />



    </div>
  );
}
