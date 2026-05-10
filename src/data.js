export const LIGHTING = [
  'Natural',
  'Golden Hour',
  'Blue Hour',
  'Studio Strobe',
  'Continuous',
  'Practical',
  'Mixed'
];

export const LENSES = ['24mm', '35mm', '50mm', '85mm', '135mm', '70-200mm', 'Macro'];

export const MOODS = [
  'Dark',
  'Airy',
  'Moody',
  'Editorial',
  'Commercial',
  'Intimate',
  'Dynamic',
  'Graphic'
];

export const SHOOT_TYPES = [
  'Fashion Editorial',
  'Brand / Commercial',
  'Portrait Session',
  'Wedding',
  'Real Estate',
  'Product',
  'Music Video',
  'Documentary',
  'Sports / Action',
  'Food & Lifestyle'
];

export const VIBES = [
  'Dark & Moody',
  'Editorial',
  'Airy & Clean',
  'Cinematic',
  'Gritty',
  'Luxury',
  'Natural',
  'High Energy'
];

export const VID_TAGS = [
  'B-Roll',
  'Lighting Ref',
  'Color Grade',
  'Movement',
  'Composition',
  'Mood'
];

export const PLANS = [
  {
    id: 'free',
    badge: 'Start Here',
    name: 'Free Trial',
    price: 0,
    note: '3 AI generations · no card required',
    tag: null,
    features: [
      { t: '3 AI shot list generations', hi: true, ok: true, ai: true },
      { t: '1 shoot saved', hi: false, ok: true },
      { t: 'Moodboard & video refs', hi: false, ok: true },
      { t: 'Manual shot planning', hi: false, ok: true },
      { t: 'Daily AI generations', hi: false, ok: false },
      { t: 'PDF export', hi: false, ok: false },
      { t: 'Team collaboration', hi: false, ok: false }
    ],
    btn: 'START FREE',
    btnC: 'btn-free',
    featured: false
  },
  {
    id: 'creator',
    badge: 'Most Popular',
    name: 'Creator',
    price: 5,
    annualPrice: 4,
    tag: 'popular',
    features: [
      { t: '1 AI generation per day', hi: true, ok: true, ai: true },
      { t: 'Unlimited shoots saved', hi: false, ok: true },
      { t: 'Moodboard & video refs', hi: false, ok: true },
      { t: 'Full shoot planner', hi: false, ok: true },
      { t: 'Schedule & crew tools', hi: false, ok: true },
      { t: 'PDF export', hi: false, ok: false },
      { t: 'Team collaboration', hi: false, ok: false }
    ],
    btn: 'GET CREATOR',
    btnC: 'btn-creator',
    featured: true
  },
  {
    id: 'pro',
    badge: 'Best Value',
    name: 'Pro',
    price: 12,
    annualPrice: 9,
    tag: null,
    features: [
      { t: 'Unlimited AI generations', hi: true, ok: true, ai: true },
      { t: 'Unlimited shoots saved', hi: false, ok: true },
      { t: 'PDF shot list export', hi: true, ok: true },
      { t: 'Priority AI responses', hi: false, ok: true },
      { t: 'Full shoot planner', hi: false, ok: true },
      { t: 'Schedule & crew tools', hi: false, ok: true },
      { t: 'Team collaboration', hi: false, ok: false }
    ],
    btn: 'GET PRO',
    btnC: 'btn-pro',
    featured: true
  },
  {
    id: 'team',
    badge: 'For Studios',
    name: 'Team',
    price: 29,
    annualPrice: 23,
    tag: 'team',
    features: [
      { t: 'Everything in Pro', hi: true, ok: true },
      { t: '3 team seats included', hi: true, ok: true },
      { t: 'Shared shoots & moodboards', hi: false, ok: true },
      { t: 'Crew collaboration tools', hi: false, ok: true },
      { t: 'Team shoot calendar', hi: false, ok: true },
      { t: 'Priority support', hi: false, ok: true },
      { t: 'Add seats — $8/seat/mo', hi: false, ok: true }
    ],
    btn: 'GET TEAM',
    btnC: 'btn-team',
    featured: false
  }
];

export const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel with one click from your account settings. No questions asked, no fees.'
  },
  {
    q: 'What counts as one AI generation?',
    a: 'Each time you hit Generate Shot List counts as one use, regardless of how many shots you request.'
  },
  {
    q: 'How does the free trial work?',
    a: 'You get 3 AI shot list generations free with no credit card. All manual planning tools are free forever.'
  },
  {
    q: 'Can I upgrade or downgrade?',
    a: 'Yes, anytime. Upgrades are immediate and prorated. Downgrades take effect at the next billing cycle.'
  }
];

// Unique ID that survives page reloads. Date.now() (ms timestamp) seeded
// at module load + a per-call counter avoids collisions across saved
// shoots restored from localStorage.
let _uid = Date.now();
export const id = () => ++_uid;
