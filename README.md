### Construcció d'un Pool de Personatges de Star Wars amb Firebase**

---

#### **Introducció**
En aquesta pràctica, aprendràs a treballar amb **Firebase**, un servei que permet gestionar dades en temps real a través d'una API-REST. El teu objectiu serà crear una aplicació que mostri un **pool de personatges de Star Wars**, on podràs:
1. Afegir personatges.
2. Modificar i eliminar personatges.
3. (Opcional) Associar imatges als personatges utilitzant Firebase Storage.

---

### **Objectius**
1. Configurar un projecte bàsic amb Firebase.
2. Aprendre a interactuar amb una base de dades de Firebase utilitzant peticions HTTP (GET, POST, PATCH, DELETE).
3. Implementar una aplicació que mostri personatges en un **HTML** i permeti gestionar-los.
4. (Opcional) Treballar amb Firebase Storage per pujar imatges.

---

## **Fase 1: Configuració inicial de Firebase**

### **1. Crear un projecte a Firebase**
1. Accedeix a [Firebase Console](https://console.firebase.google.com/).
2. Crea un nou projecte amb el nom `StarWarsPool`.
3. A la secció **Realtime Database**, fes clic a "Crea la base de dades":
   - Selecciona el mode "Públic" per començar (regles de seguretat permissives):
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```

---
### **2. Pujar dades inicials**
1. Accedeix a l'API de [SWAPI](https://swapi.info/) i obtén les dades dels personatges des de l'endpoint [https://swapi.info/api/people/](https://swapi.info/api/people/).
2. Desa les dades obtingudes en un fitxer `characters.json`.
3. Pujar el fitxer a **Realtime Database**:
    - Ves a **Realtime Database** > Clic a "Importar JSON" i selecciona el fitxer.
2. Pujar el fitxer a **Realtime Database**:
    - Ves a **Realtime Database** > Clic a "Importar JSON" i selecciona el fitxer.

---

## **Fase 2: Recuperar i mostrar dades**

### **1. Crear un fitxer HTML**
Desa aquest codi com `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pool de Personatges</title>
  <script src="./script.js" defer></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 text-gray-800">
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Pool de Personatges de Star Wars</h1>
    <div id="characters-container" class="space-y-4"></div>
  </div>
</body>
</html>
```

---

### **2. Crear un fitxer JavaScript**
Desa aquest codi com `script.js` (recorda modificar `<PROJECT-ID>` pel teu ID de projecte):

```javascript
const firebaseUrl = "https://crud-swapi-default-rtdb.europe-west1.firebasedatabase.app/characters.json";

// Funció per obtenir els personatges
async function fetchCharacters() {
  const response = await fetch(firebaseUrl);
  const data = await response.json();
  return data ? Object.entries(data).map(([id, character]) => ({ id, ...character })) : [];
}

// Funció per mostrar els personatges
async function displayCharacters() {
  const container = document.getElementById("characters-container");
  container.innerHTML = "";
  const characters = await fetchCharacters();

  characters.forEach((character) => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";
    div.innerHTML = `
      <h3 class="text-xl font-bold">${character.name}</h3>
      <p><strong>ID:</strong> ${character.id}</p>
      <p><strong>Alçada:</strong> ${character.height}</p>
      <p><strong>Massa:</strong> ${character.mass}</p>
    `;
    container.appendChild(div);
  });
}

// Inicialitza la pàgina
displayCharacters();
```

---

## **Fase 3: Afegir funcionalitat de "Create"**

1. Modifica l’HTML per afegir un formulari:
   ```html
   <h2 class="text-2xl font-semibold mt-8">Afegir Personatge</h2>
   <form id="add-character-form" class="mt-4 space-y-4">
     <input type="text" id="name" placeholder="Nom" class="w-full p-2 border rounded" required>
     <input type="number" id="height" placeholder="Alçada" class="w-full p-2 border rounded" required>
     <input type="number" id="mass" placeholder="Massa" class="w-full p-2 border rounded" required>
     <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
       Afegir
     </button>
   </form>
   ```

2. Afegeix la lògica al JavaScript per capturar dades i enviar-les a Firebase:
   ```javascript
   const addCharacterForm = document.getElementById("add-character-form");

   addCharacterForm.addEventListener("submit", async (event) => {
     event.preventDefault();
     const name = document.getElementById("name").value;
     const height = document.getElementById("height").value;
     const mass = document.getElementById("mass").value;

     const newCharacter = { name, height, mass };

     await fetch(firebaseUrl, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(newCharacter),
     });

     alert("Personatge afegit!");
     displayCharacters(); // Actualitza la llista
   });
   ```

---

## Et toca a tu

1. Afegeix les opcions per **editar** i **eliminar** a cada personatges.
2. Investiga com fer que les peticions a Firebase siguin **segures**.
3. Investiga i configura **Firebase Storage** per pujar imatges a cada personatge.
4. Afegeix un camp per seleccionar una imatge al formulari.
5. Pujar la imatge a Storage i associar l’URL a cada personatge.
