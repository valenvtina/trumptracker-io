import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, query, orderByChild, push, serverTimestamp } from 'firebase/database';
import { AnalysisEntry } from '../types/promise';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const saveAnalysis = async (entry: AnalysisEntry) => {
  try {
    // Generate a unique key for the analysis
    const analysesRef = ref(db, 'analyses');
    const newAnalysisRef = push(analysesRef);
    
    // Save analysis with generated key
    await set(newAnalysisRef, {
      ...entry,
      timestamp: serverTimestamp()
    });

    // Update promise stats
    for (const result of entry.results) {
      const statsRef = ref(db, `promiseStats/${result.promiseId}`);
      const snapshot = await get(statsRef);
      const currentStats = snapshot.val() || {
        positive: 0,
        negative: 0,
        neutral: 0,
        facts: 0,
        opinions: 0,
        lastUpdated: null
      };

      // Update impact counters
      currentStats[result.impact]++;
      // Update fact/opinion counter
      currentStats[entry.classification.toLowerCase() === 'fact' ? 'facts' : 'opinions']++;
      currentStats.lastUpdated = serverTimestamp();

      await set(statsRef, currentStats);
    }

    return true;
  } catch (error) {
    console.error('Failed to save analysis:', error);
    throw error;
  }
};

export const getAnalyses = async () => {
  try {
    const analysesRef = ref(db, 'analyses');
    const snapshot = await get(analysesRef);
    return Object.values(snapshot.val() || {});
  } catch (error) {
    console.error('Failed to get analyses:', error);
    throw error;
  }
};

export const loadPromiseStats = async () => {
  try {
    const statsRef = ref(db, 'promiseStats');
    const snapshot = await get(statsRef);
    return snapshot.val() || {};
  } catch (error) {
    console.error('Failed to load promise stats:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    const statsRef = ref(db, 'promiseStats');
    const snapshot = await get(statsRef);
    
    if (!snapshot.exists()) {
      const initialStats = {};
      for (let i = 1; i <= 20; i++) {
        initialStats[i] = {
          positive: 0,
          negative: 0,
          neutral: 0,
          facts: 0,
          opinions: 0,
          lastUpdated: serverTimestamp()
        };
      }
      await set(statsRef, initialStats);
    }
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

// Initialize database when module is imported
initializeDatabase().catch(console.error);