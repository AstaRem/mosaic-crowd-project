import React from 'react';
import { Card } from '../components/Card';
import RegisterForm from '../components/RegisterForm';
import './LoginPage.css';

export default function RegisterPage({ onRegister }) {
  return (
    <div className="auth-page">
      <Card className="auth-card">
        <RegisterForm onRegister={onRegister} />
      </Card>
    </div>
  );
}