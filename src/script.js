import {
  fetchCharacters,
  fetchCharacterById,
  createCharacter,
  deleteCharacter,
  updateCharacter,
  loginUser,
} from './api.js';

import { checkAuthStatus } from './firebase.js';

// Seleccionar elements del DOM
const form = document.getElementById('add-character-form');
const nameInput = document.getElementById('name');
const heightInput = document.getElementById('height');
const massInput = document.getElementById('mass');
const charactersContainer = document.getElementById('characters-container');
const loginForm = document.getElementById('login-form');

// Gestiona l'inici de sessió
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await loginUser(email, password);
    alert('Sessió iniciada correctament!');
    window.location.reload(); // Recarrega la pàgina per mostrar les dades
  } catch (error) {
    alert('Error iniciant sessió: ' + error.message);
  }
});

// Comprovar si l'usuari està autenticat
checkAuthStatus((user) => {
  if (user) {
    console.log('Usuari connectat:', user.email);
    // Aquí pots carregar les dades de CRUD
  } else {
    console.log('Usuari no connectat');
  }
});

// Funció per mostrar tots els personatges
async function displayCharacters() {
  try {
    const characters = await fetchCharacters();
    console.log(characters);
    charactersContainer.innerHTML = ''; // Netejar el contenidor abans d'afegir els personatges

    characters.forEach(({ id, name: nom, height: alçada, mass: pes }) => {
      // Crear el contenidor del personatge
      const characterDiv = document.createElement('div');
      characterDiv.className =
        'p-4 bg-white rounded shadow flex justify-between items-center';

      // Informació del personatge
      characterDiv.innerHTML = `
        <div>
          <p class="font-bold text-lg">${nom}</p>
          <p class="text-sm">Alçada: ${alçada} cm</p>
          <p class="text-sm">Pes: ${pes} kg</p>
        </div>
        <div class="space-x-2">
          <button data-id="${id}" class="edit-btn bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
          <button data-id="${id}" class="delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
        </div>
      `;

      charactersContainer.appendChild(characterDiv);
    });

    // Afegir esdeveniments als botons d'eliminar i editar
    attachEventListeners();
  } catch (error) {
    console.error('Error mostrant els personatges:', error);
  }
}

// Funció per afegir un nou personatge
async function addCharacter(event) {
  event.preventDefault(); // Evitar el comportament per defecte del formulari
  console.log(nameInput.value, heightInput.value, massInput.value);
  const newCharacter = {
    nom: nameInput.value,
    alçada: Number(heightInput.value),
    pes: Number(massInput.value),
  };

  try {
    await createCharacter(newCharacter);
    form.reset(); // Netejar el formulari
    displayCharacters(); // Actualitzar la llista
  } catch (error) {
    console.error('Error afegint el personatge:', error);
  }
}

// Funció per eliminar un personatge
async function removeCharacter(id) {
  try {
    await deleteCharacter(id);
    displayCharacters(); // Actualitzar la llista
  } catch (error) {
    console.error('Error eliminant el personatge:', error);
  }
}

// Funció per actualitzar un personatge (aquí es podria obrir un formulari o modal)
async function editCharacter(id) {
  try {
    const character = await fetchCharacterById(id);
    console.log(character);

    if (character) {
      nameInput.value = character.name;
      heightInput.value = character.height;
      massInput.value = character.mass;

      // Canviar el text del botó a "Desar"
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.textContent = 'Desar';

      // Modificar el comportament del formulari per actualitzar el personatge
      form.onsubmit = async (event) => {
        event.preventDefault();
        // Hem de respectar el format de les dades que espera la base de dades i, per tant, del character
        const updatedCharacter = {
          ...character,
          name: nameInput.value,
          height: Number(heightInput.value),
          mass: Number(massInput.value),
        };

        try {
          await updateCharacter(id, updatedCharacter);
          form.reset();
          submitButton.textContent = 'Afegir'; // Tornar al text inicial del botó
          form.onsubmit = addCharacter; // Tornar al comportament inicial
          displayCharacters();
        } catch (error) {
          console.error('Error actualitzant el personatge:', error);
        }
      };
    }
  } catch (error) {
    console.error('Error editant el personatge:', error);
  }
}

// Afegir esdeveniments als botons d'eliminar i editar
function attachEventListeners() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  const editButtons = document.querySelectorAll('.edit-btn');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      removeCharacter(id);
    });
  });

  editButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      editCharacter(id);
    });
  });
}

// Esdeveniment del formulari per afegir personatges
form.onsubmit = addCharacter;

// Mostrar els personatges en carregar la pàgina
displayCharacters();
