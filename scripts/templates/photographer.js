// Modèle de carte de photographe pour la page principale
function createPhotographerCard(photographerData) {
  const { name, id, city, country, tagline, price, portrait } = photographerData;
  const imagePath = `assets/photographers/${portrait}`;

  function generateCardDOM() {
    const card = document.createElement('article');
    const link = document.createElement('a');
    link.href = `photographer.html?id=${id}`;

    // Image du photographe
    const imageContainer = document.createElement('span');
    const image = document.createElement('img');
    image.setAttribute("src", imagePath);
    image.setAttribute("alt", name);
    imageContainer.appendChild(image);
    link.appendChild(imageContainer);

    // Nom du photographe
    const nameElement = document.createElement('h2');
    nameElement.textContent = name;
    link.appendChild(nameElement);

    // Informations du photographe
    const infoContainer = document.createElement('div');
    infoContainer.ariaLabel = "Informations photographe";

    // Ville et pays
    const locationElement = document.createElement('p');
    locationElement.className = 'photographerCity';
    locationElement.textContent = `${city}, ${country}`;

    // Tagline
    const taglineElement = document.createElement('p');
    taglineElement.className = 'photographerTagline';
    taglineElement.textContent = tagline;

    // Prix
    const priceElement = document.createElement('p');
    priceElement.className = 'photographerPrice';
    priceElement.textContent = `${price}€/jour`;

    // Assemblage des éléments
    infoContainer.appendChild(locationElement);
    infoContainer.appendChild(taglineElement);
    infoContainer.appendChild(priceElement);
    card.appendChild(link);
    card.appendChild(infoContainer);

    return card;
  }

  return { name, imagePath, generateCardDOM }
}

// Modèle de page détaillée pour un photographe
function createPhotographerHeader(photographerData) {
  const { name, portrait, city, country, tagline } = photographerData;
  const imagePath = `assets/photographers/${portrait}`;

  return `
      <div class="headerContainer">
          <div class="headerText">
              <h1>${name}</h1>
              <h2>${city}, ${country}</h2>
              <p class="taglineText">${tagline}</p>
          </div>
          <button class="contactButton" id="contactBtn" aria-label="Contactez-moi">Contactez-moi</button>
          <img src="${imagePath}" aria-label="${name}">
      </div>
  `;
}

// Création d'un élément média (image ou vidéo)
function createMediaCard(mediaData, photographerName) {
  if (!mediaData.image && !mediaData.video) {
    console.error('Type de média non défini');
    return;
  }
  const mediaPath = mediaData.image
    ? `assets/images/${photographerName}/${mediaData.image}`
    : `assets/images/${photographerName}/${mediaData.video}`;

  const mediaElement = mediaData.image
    ? `<img tabindex="0" class="mediaElement" data-mediaId="${mediaData.id}" src="${mediaPath}" alt="${mediaData.title}">`
    : `<div tabindex="0" aria-label="${mediaData.title}" class="videoContainer mediaElement" data-mediaId="${mediaData.id}" src="${mediaPath}"><video aria-label="${mediaData.title}, vue rapprochée" controls class="mediaElement" data-mediaId="${mediaData.id}" src="${mediaPath}"></video><div class="videoOverlay"></div></div>`;
  const likeButton = `<button aria-label="likes" class="likeButton" data-mediaId="${mediaData.id}"><i class="fa-solid fa-heart heart-icon"></i></button>`;

  return `<div class="media-container">
          ${mediaElement}
          <div class="mediaInfo">
              <h3 class="mediaTitle" data-mediaId="title_${mediaData.id}">${mediaData.title}</h3>
              <div class="likesContainer">
                  <h4 aria-label="likes" class="mediaLikes" data-mediaId="${mediaData.id}" data-likes="${mediaData.likes}">
                      ${mediaData.likes}
                  </h4>
                  ${likeButton}
              </div>
          </div>
      </div>`;
}

// Gestion des likes sur les médias
function handleMediaLike(mediaId, mediaList) {
  // On selectionne le bon bouton avec le mediaId et le media concerné
  const likeButton = document.querySelector(`.likeButton[data-mediaId="${mediaId}"]`);
  const media = mediaList.find((media) => media.id === mediaId);

  // Basculement du like on/off et update du score
  if (likeButton.classList.contains('liked')) {
    media.likes -= 1;
    likeButton.classList.remove('liked');
  } else {
    likeButton.classList.add('liked');
    media.likes += 1;
  }
  // Mise à jour de l'affichage des likes
  const likesContainer = document.querySelector(`.mediaLikes[data-mediaId="${mediaId}"]`);
  likesContainer.textContent = media.likes;
  likesContainer.setAttribute('data-likes', media.likes);
  // Mise à jour du total des likes
  updateTotalLikes();
}

// Calcul du total des likes
function updateTotalLikes() {
  const likesElem = document.querySelectorAll('.mediaLikes');
  const totalLikes = Array.from(likesElem).reduce((sum, element) =>
    sum + Number(element.getAttribute('data-likes')), 0);
  document.getElementById('likesSum').textContent = totalLikes;
}

export {
  createPhotographerHeader,
  createPhotographerCard,
  createMediaCard,
  handleMediaLike,
  updateTotalLikes
};
