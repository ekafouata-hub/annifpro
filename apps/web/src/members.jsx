import React, { useEffect, useMemo, useRef, useState } from 'react';
import './members.css';

const defaultForm = {
  fullName: '',
  birthDate: '',
  marriageDate: '',
  phone: '',
  category: 'Filleul',
  photo: '',
  couplePhoto: ''
};

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  async function fetchMembers() {
    const token = localStorage.getItem('anniv_token');
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (month) params.set('month', month);

    try {
      if (!token) {
        throw new Error('Token manquant');
      }

      const response = await fetch(`/api/members?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setMembers(result.data);
        return;
      }

      throw new Error(result.message || 'Impossible de charger les membres');
    } catch (error) {
      console.error('Erreur de chargement des membres', error);
      setMembers([
        { id: 1, fullName: 'M. et Mme. KOUASSI', category: 'Couple', birthDate: '1985-05-12', marriageDate: '2010-11-09', phone: '+229 97000000', status: 'Actif' },
        { id: 2, fullName: 'Agnès ADJÉ', category: 'Filleule', birthDate: '1992-03-21', marriageDate: '', phone: '+229 96500000', status: 'Actif' },
        { id: 3, fullName: 'Micheline DOSSOU', category: 'Filleul', birthDate: '1988-09-14', marriageDate: '2014-12-12', phone: '+229 96000000', status: 'À confirmer' }
      ]);
    }
  }

  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      try {
        await fetchMembers();
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [search, month]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setForm(defaultForm);
    setIsEditing(false);
    setSelectedMemberId(null);
  }

  function handleEdit(member) {
    setSelectedMemberId(member.id);
    setIsEditing(true);
    setForm({
      fullName: member.fullName,
      birthDate: member.birthDate,
      marriageDate: member.marriageDate,
      phone: member.phone,
      category: member.category || 'Filleul',
      photo: member.photo || '',
      couplePhoto: member.couplePhoto || ''
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('anniv_token');
    if (!token) {
      return;
    }

    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `/api/members/${selectedMemberId}` : '/api/members';

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const result = await response.json();
    if (result.success) {
      handleReset();
      await fetchMembers();
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem('anniv_token');
    if (!token) {
      return;
    }

    const response = await fetch(`/api/members/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success) {
      if (selectedMemberId === id) {
        handleReset();
      }
      await fetchMembers();
    }
  }

  const selectedMember = useMemo(
    () => members.find(member => member.id === selectedMemberId) || null,
    [members, selectedMemberId]
  );

  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(value => value.trim().replace(/["']/g, ''));
    const importedRows = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/["']/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    const token = localStorage.getItem('anniv_token');
    if (!token) {
      event.target.value = '';
      return;
    }

    for (const row of importedRows) {
      const payload = {
        fullName: row.fullName || row.nom || row.name || '',
        birthDate: row.birthDate || row['date de naissance'] || '',
        marriageDate: row.marriageDate || row['date de mariage'] || '',
        phone: row.phone || row.telephone || '',
        category: row.category || 'Filleul',
        photo: row.photo || '',
        couplePhoto: row.couplePhoto || ''
      };

      if (!payload.fullName || !payload.birthDate || !payload.marriageDate || !payload.phone) continue;

      await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    }

    event.target.value = '';
    await fetchMembers();
  }

  const total = useMemo(() => members.length, [members]);

  return (
    <div className="members-page">
      <div className="members-toolbar">
        <div className="search-box">
          <span>🔎</span>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Rechercher un membre..."
          />
        </div>

        <div className="filter-box">
          <label htmlFor="month">Filtrer par mois</label>
          <select id="month" value={month} onChange={event => setMonth(event.target.value)}>
            <option value="">Tous</option>
            <option value="1">Janvier</option>
            <option value="2">Février</option>
            <option value="3">Mars</option>
            <option value="4">Avril</option>
            <option value="5">Mai</option>
            <option value="6">Juin</option>
            <option value="7">Juillet</option>
            <option value="8">Août</option>
            <option value="9">Septembre</option>
            <option value="10">Octobre</option>
            <option value="11">Novembre</option>
            <option value="12">Décembre</option>
          </select>
        </div>

        <div className="import-box">
          <button type="button" className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
            Import Excel / CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" hidden onChange={handleImport} />
        </div>
      </div>

      <form className="member-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Nom complet</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Ex: Koffi Mensah" />
        </div>
        <div className="field">
          <label>Catégorie</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="Filleul">Filleul</option>
            <option value="Filleule">Filleule</option>
            <option value="Couple">Couple</option>
          </select>
        </div>
        <div className="field">
          <label>Date de naissance</label>
          <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Date de mariage</label>
          <input type="date" name="marriageDate" value={form.marriageDate} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Téléphone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+229 ..." />
        </div>
        <div className="field">
          <label>Photo de profil</label>
          <input name="photo" value={form.photo} onChange={handleChange} placeholder="URL image" />
        </div>
        <div className="field">
          <label>Photo du couple</label>
          <input name="couplePhoto" value={form.couplePhoto} onChange={handleChange} placeholder="URL image" />
        </div>
        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={handleReset}>Réinitialiser</button>
          <button type="submit" className="primary-btn">
            {isEditing ? 'Mettre à jour' : 'Ajouter le membre'}
          </button>
        </div>
      </form>

      {selectedMember && (
        <div className="detail-card">
          <div className="panel-header">
            <h3>Détail du membre</h3>
            <button className="action-btn" type="button" onClick={() => handleEdit(selectedMember)}>Modifier</button>
          </div>
          <div className="detail-grid">
            <div>
              <span className="detail-label">Nom</span>
              <strong>{selectedMember.fullName}</strong>
            </div>
            <div>
              <span className="detail-label">Téléphone</span>
              <strong>{selectedMember.phone}</strong>
            </div>
            <div>
              <span className="detail-label">Naissance</span>
              <strong>{selectedMember.birthDate}</strong>
            </div>
            <div>
              <span className="detail-label">Mariage</span>
              <strong>{selectedMember.marriageDate}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="panel-card">
        <div className="panel-header">
          <h3>Liste des membres</h3>
          <span className="chip success">{total} total</span>
        </div>

        {loading ? (
          <p className="empty-state">Chargement...</p>
        ) : (
          <div className="member-table-wrap">
            <table className="member-table">
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Catégorie</th>
                  <th>Date naissance</th>
                  <th>Date mariage</th>
                  <th>Téléphone</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-name">
                        <div className="member-avatar">{member.fullName.charAt(0)}</div>
                        <span>{member.fullName}</span>
                      </div>
                    </td>
                    <td>{member.category}</td>
                    <td>{member.birthDate}</td>
                    <td>{member.marriageDate}</td>
                    <td>{member.phone}</td>
                    <td>
                      <span className={`status-badge ${member.status || 'active'}`}>
                        {member.status || 'Actif'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn" type="button" onClick={() => setSelectedMemberId(member.id)}>Voir</button>
                        <button className="action-btn" type="button" onClick={() => handleEdit(member)}>Modifier</button>
                        <button className="action-btn delete" type="button" onClick={() => handleDelete(member.id)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
