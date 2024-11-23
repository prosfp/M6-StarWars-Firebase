import { database } from './firebase'; // Assegura't de configurar Firebase al fitxer firebase.js
import { ref, get, set, remove, push } from 'firebase/database';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log('Usuari autenticat:', userCredential.user);
    return userCredential.user; // Retorna les dades de l'usuari
  } catch (error) {
    console.error('Error iniciant sessió:', error.message);
    throw error;
  }
}

/**
 * Obtenir tots els personatges
 * @returns {Promise<Array>} Llista de personatges amb els seus IDs
 */
export async function fetchCharacters() {
  try {
    const dbRef = ref(database, 'characters');
    const snapshot = await get(dbRef);
    const data = snapshot.val();

    return data
      ? Object.entries(data).map(([id, character]) => ({ id, ...character }))
      : [];
  } catch (error) {
    console.error('Error obtenint els personatges:', error.message);
    throw error;
  }
}

/**
 * Obtenir un personatge pel seu ID
 * @param {string} id - ID del personatge
 * @returns {Promise<Object|null>} Dades del personatge o null si no existeix
 */
export async function fetchCharacterById(id) {
  try {
    const dbRef = ref(database, `characters/${id}`); // Referència al personatge específic
    const snapshot = await get(dbRef);
    return snapshot.val();
  } catch (error) {
    console.error(`Error obtenint el personatge amb ID ${id}:`, error);
    return null;
  }
}

/**
 * Crear un nou personatge
 * @param {Object} characterData - Dades del personatge
 * @returns {Promise<string>} ID del personatge creat
 */
export async function createCharacter(characterData) {
  try {
    const dbRef = ref(database, 'characters'); // Referència a 'characters'
    const newCharacterRef = push(dbRef); // Crear una nova entrada amb un ID únic
    await set(newCharacterRef, characterData); // Guardar les dades a la nova entrada
    console.log('Personatge creat:', newCharacterRef.key);
    return newCharacterRef.key; // Retorna l'ID del nou personatge
  } catch (error) {
    console.error('Error creant un nou personatge:', error);
    throw error;
  }
}

/**
 * Actualitzar un personatge existent
 * @param {string} id - ID del personatge
 * @param {Object} characterData - Noves dades del personatge
 * @returns {Promise<void>}
 */
export async function updateCharacter(id, characterData) {
  try {
    const dbRef = ref(database, `characters/${id}`); // Referència al personatge específic
    await set(dbRef, characterData); // Actualitzar les dades del personatge
  } catch (error) {
    console.error(`Error actualitzant el personatge amb ID ${id}:`, error);
    throw error;
  }
}

/**
 * Eliminar un personatge
 * @param {string} id - ID del personatge
 * @returns {Promise<void>}
 */
export async function deleteCharacter(id) {
  try {
    const dbRef = ref(database, `characters/${id}`); // Referència al personatge específic
    await remove(dbRef); // Eliminar el personatge de la base de dades
  } catch (error) {
    console.error(`Error eliminant el personatge amb ID ${id}:`, error);
    throw error;
  }
}
