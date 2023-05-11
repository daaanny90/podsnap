import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import credentials from './../../../../credentials/firebase_credentials.json'

const firebaseConfig = credentials

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
