// Import du template de la card photographe
import { createPhotographerCard } from '../templates/photographer.js'
// Récupére les données des photographes depuis un fichier JSON
async function getPhotographersData() {
    const response = await fetch('data/photographers.json');
    if (!response.ok) {
        throw new Error('Fetch error')
    }
    const photographersData = await response.json();
    return photographersData;
}
// Fonction pour afficher les cartes des photographes sur la page
async function renderPhotographerCards(photographers) {
    const photographersContainer = document.querySelector(".photographerSection");
    photographers.forEach((photographerInfo) => {
        // Utilise un template pour créer la carte du photographe dans templates/photographer.js
        const photographerCard = createPhotographerCard(photographerInfo);
        const cardElement = photographerCard.generateCardDOM();
        photographersContainer.appendChild(cardElement);
    });
}
// Init
async function init() {
    const { photographers } = await getPhotographersData();
    renderPhotographerCards(photographers);
}
init();
