import React, { useState } from 'react';
import './login.css';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('ekafouata@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      if (email === 'ekafouata@gmail.com' && password === 'admin123') {
        const demoUser = {
          id: 1,
          fullName: 'Ekafouata Koudjo',
          email,
          role: 'Super Administrateur'
        };

        localStorage.setItem('anniv_token', 'demo-token');
        localStorage.setItem('anniv_user', JSON.stringify(demoUser));
        setStatus({ type: 'success', message: 'Connexion réussie.' });
        onLoginSuccess?.(demoUser);
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Identifiants invalide');
      }

      localStorage.setItem('anniv_token', result.token);
      localStorage.setItem('anniv_user', JSON.stringify(result.user));
      setStatus({ type: 'success', message: 'Connexion réussie.' });
      onLoginSuccess?.(result.user);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Une erreur est survenue.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <p>Association</p>
            <h2>ISAAC ET REBECCA</h2>
          </div>
        </div>

        <h1 className="login-title">Connexion</h1>
        <p className="login-subtitle">
          Accédez au tableau de bord pour gérer les anniversaires, les rappels et les vœux.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="nom@exemple.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="login-actions">
            <label className="remember">
              <input type="checkbox" defaultChecked />
              Se souvenir de moi
            </label>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>

        {status.message && (
          <div className={`login-status ${status.type === 'error' ? 'error' : ''} visible`}>
            {status.message}
          </div>
        )}

        <div className="login-footer">
          Besoin d’aide ? <a href="#">Contactez l’administrateur</a>
        </div>
      </div>
    </div>
  );
}
