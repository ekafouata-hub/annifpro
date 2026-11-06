const express = require('express');
const { members } = require('../data/mockData');

const router = express.Router();

let memberStore = [...members];

router.get('/', (req, res) => {
  const { month, search } = req.query;

  let filteredMembers = [...memberStore];

  if (search) {
    const term = search.toLowerCase();
    filteredMembers = filteredMembers.filter(member =>
      member.fullName.toLowerCase().includes(term) ||
      member.phone.toLowerCase().includes(term)
    );
  }

  if (month) {
    filteredMembers = filteredMembers.filter(member => {
      const birthMonth = new Date(member.birthDate).getMonth() + 1;
      const marriageMonth = new Date(member.marriageDate).getMonth() + 1;
      return Number(month) === birthMonth || Number(month) === marriageMonth;
    });
  }

  res.json({
    success: true,
    count: filteredMembers.length,
    data: filteredMembers
  });
});

router.get('/:id', (req, res) => {
  const member = memberStore.find(item => item.id === Number(req.params.id));

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Membre introuvable'
    });
  }

  return res.json({
    success: true,
    data: member
  });
});

router.post('/', (req, res) => {
  const payload = req.body || {};

  if (!payload.fullName || !payload.birthDate || !payload.marriageDate || !payload.phone) {
    return res.status(400).json({
      success: false,
      message: 'Les champs obligatoires sont manquants.'
    });
  }

  const newMember = {
    id: Date.now(),
    fullName: payload.fullName,
    birthDate: payload.birthDate,
    marriageDate: payload.marriageDate,
    phone: payload.phone,
    category: payload.category || 'Filleul',
    photo: payload.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    couplePhoto: payload.couplePhoto || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  };

  memberStore.unshift(newMember);

  return res.status(201).json({
    success: true,
    data: newMember
  });
});

router.put('/:id', (req, res) => {
  const memberIndex = memberStore.findIndex(item => item.id === Number(req.params.id));

  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Membre introuvable'
    });
  }

  memberStore[memberIndex] = {
    ...memberStore[memberIndex],
    ...req.body,
    id: Number(req.params.id)
  };

  return res.json({
    success: true,
    data: memberStore[memberIndex]
  });
});

router.delete('/:id', (req, res) => {
  const memberIndex = memberStore.findIndex(item => item.id === Number(req.params.id));

  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Membre introuvable'
    });
  }

  memberStore.splice(memberIndex, 1);

  return res.json({
    success: true,
    message: 'Membre supprimé avec succès.'
  });
});

module.exports = router;
