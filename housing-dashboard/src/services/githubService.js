// GitHub API Service for auto-saving housing data
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'M2KPortal';
const REPO_NAME = 'M2KPortal.github.io';
const BRANCH = 'main';
const DATA_FILE_PATH = 'm2k_2026_housing_data (1).json';

// Get GitHub token from localStorage
const getToken = () => {
  const settings = localStorage.getItem('githubSettings');
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      return parsed.token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Save GitHub token
export const saveGitHubToken = (token) => {
  const settings = {
    token,
    owner: REPO_OWNER,
    repo: REPO_NAME,
    branch: BRANCH,
    filePath: DATA_FILE_PATH,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('githubSettings', JSON.stringify(settings));
};

// Check if GitHub token exists
export const hasGitHubToken = () => {
  return !!getToken();
};

// Remove GitHub token
export const clearGitHubToken = () => {
  localStorage.removeItem('githubSettings');
};

// Fetch current file SHA and content
const getFileSha = async (token) => {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(DATA_FILE_PATH)}?ref=${BRANCH}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // File doesn't exist yet
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.sha;
};

// Load housing data from GitHub
export const loadHousingData = async () => {
  try {
    const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${encodeURIComponent(DATA_FILE_PATH)}?t=${Date.now()}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        // File doesn't exist, return initial data structure
        return getInitialData();
      }
      throw new Error(`Failed to load data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading housing data:', error);
    return getInitialData();
  }
};

// Save housing data to GitHub
export const saveHousingData = async (data) => {
  const token = getToken();

  if (!token) {
    throw new Error('GitHub token not configured. Please set it in Settings.');
  }

  try {
    // Get current file SHA
    const currentSha = await getFileSha(token);

    // Prepare data
    const content = JSON.stringify(data, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Prepare commit message
    const now = new Date();
    const message = `Update housing data - ${now.toLocaleString()}`;

    // Prepare request body
    const body = {
      message,
      content: encodedContent,
      branch: BRANCH
    };

    // Include SHA only if file exists
    if (currentSha) {
      body.sha = currentSha;
    }

    // Make API request
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(DATA_FILE_PATH)}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      commitSha: result.commit.sha.substring(0, 7)
    };
  } catch (error) {
    console.error('Error saving to GitHub:', error);
    throw error;
  }
};

// Get initial data structure
const getInitialData = () => ({
  version: '3.0',
  lastUpdated: new Date().toISOString(),
  youthGroups: [],
  rooms: [],
  housingRooms: [],
  smallGroupRooms: [],
  housingAssignments: {
    male: {},
    female: {}
  },
  smallGroupAssignments: {},
  mealColorAssignments: {},
  mealTimes: {
    'Blue': { satBreakfast: '7:00 AM', satLunch: '12:00 PM', satDinner: '5:30 PM', sunBreakfast: '7:30 AM' },
    'Red': { satBreakfast: '7:15 AM', satLunch: '12:15 PM', satDinner: '5:45 PM', sunBreakfast: '7:45 AM' },
    'Orange': { satBreakfast: '7:30 AM', satLunch: '12:30 PM', satDinner: '6:00 PM', sunBreakfast: '8:00 AM' },
    'Yellow': { satBreakfast: '7:45 AM', satLunch: '12:45 PM', satDinner: '6:15 PM', sunBreakfast: '8:15 AM' },
    'Green': { satBreakfast: '8:00 AM', satLunch: '1:00 PM', satDinner: '6:30 PM', sunBreakfast: '8:30 AM' },
    'Purple': { satBreakfast: '8:15 AM', satLunch: '1:15 PM', satDinner: '6:45 PM', sunBreakfast: '8:45 AM' },
    'Brown': { satBreakfast: '8:30 AM', satLunch: '1:30 PM', satDinner: '7:00 PM', sunBreakfast: '9:00 AM' },
    'Grey': { satBreakfast: '8:45 AM', satLunch: '1:45 PM', satDinner: '7:15 PM', sunBreakfast: '9:15 AM' }
  },
  activeColors: ['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple'],
  adaIndividuals: [],
  defaultNotes: {
    generalInfo: '',
    housingNotes: '',
    teenShowerPlan: '',
    adultShowerPlan: ''
  },
  groupNotes: {},
  resources: []
});

export default {
  loadHousingData,
  saveHousingData,
  saveGitHubToken,
  hasGitHubToken,
  clearGitHubToken
};
