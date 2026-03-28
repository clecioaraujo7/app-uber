// === STATE & CONSTANTS ===
let profiles = {};
let activeProfile = null;
let currentFilter = 'all';
let dateFilter = { from: null, to: null };

const STORAGE_KEY   = 'uber_profiles';
const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
const FILTER_MAP    = { todos: 'all', hoje: 'today', semana: 'week', mes: 'month' };
const CHART_COLORS  = { primary: '#00D4FF', secondary: '#0066FF', grid: '#1e3a5f', text: '#5a8ab0' };
const MS_PER_DAY    = 864e5;
