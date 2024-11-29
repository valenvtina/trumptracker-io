import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, serverTimestamp } from 'firebase/database';
import { AnalysisEntry, AnalysisResult } from '../types/promise';

const firebaseConfig = {
  apiKey: "AIzaSyDZwgGxOPYXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "trump-tracker-XXXXX.firebaseapp.com",
  databaseURL: "https://trump-tracker-XXXXX.firebaseio.com",
  projectId: "trump-tracker-XXXXX",
  storageBucket: "trump-tracker-XXXXX.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXXXXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const saveAnalysis = async (entry: AnalysisEntry) => {
  try {
    const analysisRef = ref(db, 'analyses/' + Date.now());
    await set(analysisRef, {
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
        opinions: 0
      };

      const updates = {
        [`${result.impact}`]: currentStats[result.impact] + 1,
        [entry.classification === 'FACT' ? 'facts' : 'opinions']: 
          currentStats[entry.classification === 'FACT' ? 'facts' : 'opinions'] + 1,
        lastUpdated: serverTimestamp()
      };

      await update(statsRef, updates);
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
    return snapshot.val() || {};
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