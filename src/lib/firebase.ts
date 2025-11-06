import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfcoyesF3YcjdK-ytc9NoThwRNIw8aO2Q",
  authDomain: "ai-book-recommendation-84475.firebaseapp.com",
  projectId: "ai-book-recommendation-84475",
  storageBucket: "ai-book-recommendation-84475.firebasestorage.app",
  messagingSenderId: "262162539551",
  appId: "1:262162539551:web:8e05eed810c7d4d36da12a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
