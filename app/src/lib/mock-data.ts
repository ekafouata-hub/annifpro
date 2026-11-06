export type Member = {
  id: string;
  full_name: string;
  phone: string;
  category: string;
  birth_date: string | null;
  marriage_date: string | null;
  is_active: boolean;
  photo_profile: string | null;
};

export const mockMembers: Member[] = [
  {
    id: "m-01",
    full_name: "M. et Mme. KOUASSI",
    phone: "+229 96 12 34 56",
    category: "Couple",
    birth_date: null,
    marriage_date: "1999-11-09",
    is_active: true,
    photo_profile: null,
  },
  {
    id: "m-02",
    full_name: "Agnès ADJÉ",
    phone: "+229 95 44 21 87",
    category: "Filleul",
    birth_date: "1992-11-10",
    marriage_date: null,
    is_active: true,
    photo_profile: null,
  },
  {
    id: "m-03",
    full_name: "Micheline DOSSOU",
    phone: "+229 97 71 65 10",
    category: "Filleule",
    birth_date: "1987-11-11",
    marriage_date: null,
    is_active: true,
    photo_profile: null,
  },
  {
    id: "m-04",
    full_name: "Jean-Baptiste HOUESSOU",
    phone: "+229 90 10 88 41",
    category: "Filleul",
    birth_date: "1989-12-04",
    marriage_date: null,
    is_active: true,
    photo_profile: null,
  },
  {
    id: "m-05",
    full_name: "Didier et Félicité BOKO",
    phone: "+229 68 20 30 15",
    category: "Couple",
    birth_date: null,
    marriage_date: "2001-12-18",
    is_active: true,
    photo_profile: null,
  },
];

export const reminderHighlights = [
  {
    name: "M. et Mme. KOUASSI",
    type: "Mariage",
    date: "Samedi 09 Nov",
    stage: "Rappel final",
    status: "SMS + WhatsApp",
  },
  {
    name: "Agnès ADJÉ",
    type: "Naissance",
    date: "Dimanche 10 Nov",
    stage: "Préparation",
    status: "Message prêt",
  },
  {
    name: "Micheline DOSSOU",
    type: "Naissance",
    date: "Lundi 11 Nov",
    stage: "À confirmer",
    status: "Poster en cours",
  },
];

export const dashboardTemplates = [
  { name: "Célébration classique", tone: "sky" },
  { name: "Carte moderne", tone: "violet" },
  { name: "Design élégant", tone: "amber" },
];

export function formatDateFr(dateValue: string | null) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
