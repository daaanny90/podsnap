// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import credentials from './../../../../credentials/firebase_credentials.json'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// 	apiKey: 'AIzaSyCfKbeqmYLpiNYh-6ZwphM3fCsy16pz6mw',
// 	authDomain: 'podsnap.firebaseapp.com',
// 	projectId: 'podsnap',
// 	storageBucket: 'podsnap.appspot.com',
// 	messagingSenderId: '1049471819005',
// 	appId: '1:1049471819005:web:6979cf48f49c206b227294',
// 	measurementId: 'G-94LRVCJ8NM'
// };

const firebaseConfig = credentials

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);