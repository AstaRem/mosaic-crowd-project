// src/App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'

import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SubmitPage from './pages/SubmitPage'
import MyStoriesPage from './pages/MyStoriesPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const handleLogin = (data) => {
    setUser({ id: data.id, role: data.role, name: data.name })
    navigate('/')         // back to homepage after login
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
<>
    <Routes>
      {/* everything inside here gets the header/footer */}
      <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<HomePage user={user} />} />

            {/* public auth */}
            <Route path="login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="register" element={<RegisterPage />} />

            {/* protected */}
            <Route
              path="submit"
              element={user
                ? <SubmitPage authorId={user.id} />
                : <Navigate to="/login" />}
            />
            <Route
              path="my-stories"
              element={user
                ? <MyStoriesPage />
                : <Navigate to="/login" />}
            />

            {/* admin only */}
            <Route
              path="admin"
              element={user?.role === 'admin'
                ? <AdminPage />
                : <Navigate to="/" />}
            />
      </Route>

      {/* fallback for any other path */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    {/* <div className="colors">
      <div className="color1">background</div>
      <div className="color2">background-darker</div>
      <div className="color3">dark</div>
      <div className="color4">medium</div>
      <div className="color5">lighter</div>
      <div className="color6">contrasting</div>
    </div> */}
</>
  )
}
