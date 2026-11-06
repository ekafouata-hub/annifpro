import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './login';
import MembersPage from './members';
import './styles.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('anniv_token')));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('anniv_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState({
    today: [],
    tomorrow: [],
    week: 0,
    month: 0,
    templates: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function fetchSummary() {
      try {
        const token = localStorage.getItem('anniv_token');
        if (!token) {
          throw new Error('Token manquant');
        }

        const response = await fetch('/api/dashboard/summary', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.success) {
          setSummary(result.data);
          return;
        }

        throw new Error(result.message || 'Impossible de charger le tableau de bord');
      } catch (error) {
        console.error('Erreur de chargement du dashboard', error);
        setSummary({
          today: [
            { id: 1, name: 'M. et Mme. KOUASSI', type: 'Mariage', status: 'Envoyé' },
            { id: 2, name: 'Agnès ADJÉ', type: 'Naissance', status: 'À préparer' }
          ],
          tomorrow: [
            { id: 3, name: 'Micheline DOSSOU', type: 'Naissance', status: 'À préparer' },
            { id: 4, name: 'Serge CODO', type: 'Mariage', status: 'À préparer' }
          ],
          week: 9,
          month: 18,
          templates: {
            birth: { title: 'Carte d’anniversaire classique' },
            marriage: { title: 'Carte de célébration du couple' }
          }
        });
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === 'dashboard') {
      fetchSummary();
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={userData => {
      setUser(userData);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    }} />;
  }

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">A</div>
          <div>
            <p className="brand-subtitle">Association</p>
            <h2>ISAAC ET REBECCA</h2>
          </div>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Tableau de bord
          </button>
          <button
            className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Membres
          </button>
          <button className="nav-item">Anniversaires</button>
          <button className="nav-item">Messages</button>
          <button className="nav-item">Rapports</button>
        </nav>

        <div className="profile-box">
          <span>Connecté</span>
          <strong>{user?.fullName || 'Responsable'}</strong>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>{activeTab === 'dashboard' ? 'Anniv-Reminder' : 'Gestion des membres'}</h1>
          </div>
          <div className="top-actions">
            <button className="ghost-btn" onClick={() => {
              localStorage.removeItem('anniv_token');
              localStorage.removeItem('anniv_user');
              setIsAuthenticated(false);
              setUser(null);
              setActiveTab('dashboard');
            }}>
              Déconnexion
            </button>
            <button className="primary-btn">Nouveau rappel</button>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <>
            <div className="stats-grid">
              <article className="stat-card">
                <span className="label">Aujourd'hui</span>
                <strong>{summary.today.length}</strong>
                <small>anniversaires</small>
              </article>
              <article className="stat-card">
                <span className="label">Demain</span>
                <strong>{summary.tomorrow.length}</strong>
                <small>personnes</small>
              </article>
              <article className="stat-card">
                <span className="label">Cette semaine</span>
                <strong>{summary.week}</strong>
                <small>événements</small>
              </article>
              <article className="stat-card">
                <span className="label">Ce mois</span>
                <strong>{summary.month}</strong>
                <small>fêtes</small>
              </article>
            </div>

            <div className="content-grid">
              <article className="panel-card large-panel">
                <div className="panel-header">
                  <h3>Anniversaires du jour</h3>
                  <span className="chip success">Actif</span>
                </div>

                {loading ? (
                  <p className="empty-state">Chargement...</p>
                ) : summary.today.length === 0 ? (
                  <p className="empty-state">Aucun anniversaire aujourd'hui.</p>
                ) : (
                  <div className="list-stack">
                    {summary.today.map(item => (
                      <div className="person-row" key={item.id}>
                        <div className="avatar" aria-label={item.name}>{item.name.charAt(0)}</div>
                        <div>
                          <h4>{item.name}</h4>
                          <p>{item.type}</p>
                        </div>
                        <span className="status-pill">{item.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Demain</h3>
                  <span className="chip info">À prévoir</span>
                </div>

                {summary.tomorrow.length === 0 ? (
                  <p className="empty-state">Aucun rappel demain.</p>
                ) : (
                  <div className="list-stack compact">
                    {summary.tomorrow.map(item => (
                      <div className="mini-item" key={item.id}>
                        <strong>{item.name}</strong>
                        <span>{item.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>

            <div className="templates-row">
              <article className="panel-card">
                <div className="panel-header">
                  <h3>Modèles de messages</h3>
                </div>
                <div className="template-list">
                  {summary.templates.birth && (
                    <div className="template-item">
                      <span className="template-badge birth">Naissance</span>
                      <p>{summary.templates.birth.title}</p>
                    </div>
                  )}
                  {summary.templates.marriage && (
                    <div className="template-item">
                      <span className="template-badge marriage">Mariage</span>
                      <p>{summary.templates.marriage.title}</p>
                    </div>
                  )}
                </div>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Actions rapides</h3>
                </div>
                <div className="quick-actions">
                  <button>Envoyer WhatsApp</button>
                  <button>Exporter image</button>
                  <button>Voir calendrier</button>
                </div>
              </article>
            </div>
          </>
        ) : (
          <MembersPage />
        )}
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
