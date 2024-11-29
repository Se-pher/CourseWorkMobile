import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBV-R4KbXMGqdAujA4mZNFJUuI_LyeexDA",
  authDomain: "yoga-2f931.firebaseapp.com",
  databaseURL: "https://yoga-2f931-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yoga-2f931",
  storageBucket: "yoga-2f931.appspot.com",
  messagingSenderId: "110085343407",
  appId: "1:110085343407:web:43def7e546c49766d56c5a",
  measurementId: "G-6Y1YHQM8G3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, database };