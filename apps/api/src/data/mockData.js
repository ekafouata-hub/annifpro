const members = [
  {
    id: 1,
    fullName: 'Koffi Mensah',
    birthDate: '1992-05-15',
    marriageDate: '2017-08-22',
    phone: '+229 90 00 00 01',
    category: 'Filleul',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  },
  {
    id: 2,
    fullName: 'Grace Djebar',
    birthDate: '1989-11-28',
    marriageDate: '2015-09-12',
    phone: '+229 90 00 00 02',
    category: 'Filleule',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  },
  {
    id: 3,
    fullName: 'Daniel et Sarah Kokou',
    birthDate: '1990-02-10',
    marriageDate: '2014-06-15',
    phone: '+229 90 00 00 03',
    category: 'Couple',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  },
  {
    id: 4,
    fullName: 'Mariam Tchadji',
    birthDate: '1994-12-07',
    marriageDate: '2018-04-19',
    phone: '+229 90 00 00 04',
    category: 'Filleule',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1529154691717-3306083d869e?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  }
];

const reminderTemplates = {
  birth: {
    title: 'Joyeux anniversaire',
    text: '🎂 Joyeux anniversaire à notre cher filleul [NOM] ! Toute la grande famille ISAAC ET REBECCA, filleuls de l\'Honorable KOUKPEMEDJI Louis, te souhaite une journée remplie de joie, de santé et de bonheur. Que Dieu te bénisse abondamment !'
  },
  marriage: {
    title: 'Anniversaire de mariage',
    text: '💍 Joyeux anniversaire de mariage à notre merveilleux couple [NOM DU COUPLE] ! [X] ans d\'amour et de complicité. Que le Seigneur continue de bénir votre union. Famille ISAAC ET REBECCA vous célèbre !'
  }
};

const dashboardStats = {
  today: [
    { id: 1, name: 'Grace Djebar', type: 'Naissance', date: '2026-11-05', status: 'Message prêt' }
  ],
  tomorrow: [
    { id: 2, name: 'Koffi Mensah', type: 'Mariage', date: '2026-11-06', status: 'Image prête' }
  ],
  week: 12,
  month: 38
};

module.exports = {
  members,
  reminderTemplates,
  dashboardStats
};
