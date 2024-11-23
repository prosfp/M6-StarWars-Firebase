import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBvvS8HZ4X6l2pTNj4W3t3yaB6yJRk5Axg',
  authDomain: 'TU_PROJECT_ID.firebaseapp.com',
  databaseURL:
    'https://crud-swapi-default-rtdb.europe-west1.firebasedatabase.app/',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_PROJECT_ID.appspot.com',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID',
  appId: 'TU_APP_ID',
};

// Inicialitza Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// Comprovar l'estat de l'usuari autenticat
export function checkAuthStatus(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user); // Retorna l'usuari autenticat o `null` si no està autenticat
  });
}
