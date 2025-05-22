import React from 'react';
import { Card } from '../components/Card';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  return (
    <div className="auth-page">
      <Card className="auth-card">
        <LoginForm onLogin={onLogin} />
      </Card>
    </div>
  );
}
