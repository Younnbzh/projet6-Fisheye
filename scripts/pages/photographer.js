import { setupPopupInteractions } from '../utils/contactForm.js'
import { createPhotographerHeader, createMediaCard, handleMediaLike, updateTotalLikes } from '../templates/photographer.js';

/*
* Récupère les détails d'un photographe
* param id - identifiant unique du photographe
*/
async function getPhotographerInfosById(id) {
  try {
    // Récupération du fichier JSON contenant les données des photographes
    const response = await fetch('data/photographers.json');
    if (!response.ok) {
      throw new Error('Fetch error')
    }
    const photographersData = await response.json();
    // Transformation des données des photographes en objets structurés
    const photographerProfiles = photographersData.photographers.map((photographerRaw) => ({
      id: photographerRaw.id,
      name: photographerRaw.name,
      firstname: photographerRaw.firstname,
      city: photographerRaw.city,
      country: photographerRaw.country,
      tagline: photographerRaw.tagline,
      portrait: photographerRaw.portrait,
      price: photographerRaw.price
    }));
    // Recherche du photographe correspondant à l'id dans les data
    const matchingPhotographer = photographerProfiles.find(
      (photographerProfile) => photographerProfile.id === Number(id)
    );
    // Retour du tableau du photographe 
    return matchingPhotographer;
  } catch (error) {
    // log de l'erreur
    console.error(error);
    return []
  }
}
/*
* Récupère les médias associés à un photographe spécifique et retourne un tableau de médias du photographe
* param id - identifiant unique du photographe
*/
async function getMediaInfosById(id) {
  try {
    // Récupération du fichier JSON contenant les données des médias
    const response = await fetch('data/photographers.json')
    if (!response.ok) {
      throw new Error('Fetch error')
    }
    const mediaData = await response.json()
    // Filtrage de l'ensemble des médias en ne gardant que ceux correspondant à l'ID du photographe
    const mediaItems = mediaData.media.filter((mediaItem) => mediaItem.photographerId === Number(id))
    return mediaItems
  } catch (error) {
    console.error(error)
    return []
  }
}

/*
* Met à jour l'affichage des médias avec tri par date, alpha et popularité
* param mediaList - Liste des médias
* param sortMethod - Critère de tri ('popularity', 'title', 'date')
* param photographerInfo - tableau info photographe
*/
function updateMediaList(mediaList, sortMethod, photographerInfo) {
  // fonction de tri selon le critère sélectionné
  const sortMediaByCriteria = (media) => {
    switch (sortMethod) {
      case 'popularity':
        return media.sort((a, b) => b.likes - a.likes);
      case 'title':
        return media.sort((a, b) => a.title.localeCompare(b.title));
      case 'date':
        return media.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      default:
        return media;
    }
  };
  const mediaToSort = Array.from(mediaList);
  const sortedMediaList = sortMediaByCriteria(mediaToSort);
  // Génére le HTML des médias triés
  const generateMediaHTML = (mediaItems) => {
    return mediaItems.map(mediaItem =>
      createMediaCard(mediaItem, photographerInfo.firstname)
    ).join('');
  };
  // Maj conteneur médias
  const mediaContainer = document.getElementById('mediaContainer');
  mediaContainer.innerHTML = generateMediaHTML(sortedMediaList);

  // Gestion des likes
  const likeButtons = Array.from(document.getElementsByClassName('likeButton'));
  likeButtons.forEach((likeButton) => {
    likeButton.addEventListener('click', () => {
      const mediaId = Number(likeButton.getAttribute('data-mediaId'));
      handleMediaLike(mediaId, mediaList);
    });
  });
  updateTotalLikes();
  // Listener open lightbox
  const mediaElements = Array.from(document.getElementsByClassName('mediaElement'));
  mediaElements.forEach((mediaItem, index) => {
    mediaItem.addEventListener('click', () => {
      createLightbox(index, mediaList, mediaItem);
    });
    mediaItem.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        createLightbox(index, mediaList, mediaItem);
      }
    });
  });
}

/*
* Affiche les informations détaillées d'un photographe et de ses médias
*/
async function createPhotographerPage() {
  // Extraction de l'identifiant du photographe depuis l'URL
  const urlPhotographerId = new URLSearchParams(window.location.search);
  const photographerId = urlPhotographerId.get('id');
  // Récupération des informations du photographe
  const photographerProfile = await getPhotographerInfosById(photographerId);
  if (photographerProfile) {
    // Affichage des informations du photographe dans l'en-tête
    const photographerInfoContainer = document.getElementById('photographHeader');
    const photographerInfoHTML = createPhotographerHeader(photographerProfile);
    photographerInfoContainer.innerHTML = photographerInfoHTML;
    // Mise à jour du tarif journalier
    const dailyRateElement = document.getElementById('dailyRate');
    dailyRateElement.textContent = `${photographerProfile.price}€/jour`;
    // Ajout du nom de l'artiste à la popup contact
    const modalPhotographernameElement = document.getElementById('modalPhotographername');
    modalPhotographernameElement.textContent = `${photographerProfile.name}`;
    // On ajoute les listeners de la popup contact
    setupPopupInteractions();

    // Récupération des médias du photographe
    const photographerMediaList = await getMediaInfosById(photographerId);
    // Tri par défaut
    let currentSortMethod = 'popularité';
    // Fonction de tri
    const sortOptions = document.querySelectorAll('.optionItem');

    const handleSortOptionSelection = (selectedOption) => {
      currentSortMethod = selectedOption.dataset.sort;
      updateMediaList(photographerMediaList, currentSortMethod, photographerProfile);
    };
    sortOptions.forEach((option) => {
      option.addEventListener('click', () => handleSortOptionSelection(option));
      option.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          handleSortOptionSelection(option);
        }
      });
    });
    // Affichage initial des médias
    const mediaContainer = document.getElementById('mediaContainer');
    const generateMediaHTML = () => {
      return photographerMediaList
        .map((mediaItem) => createMediaCard(mediaItem, photographerProfile.firstname))
        .join('');
    };
    mediaContainer.innerHTML = generateMediaHTML();
    // Listener lightbox
    const mediaElements = Array.from(document.getElementsByClassName('mediaElement'));
    mediaElements.forEach((mediaItem, index) => {
      const openMediaLightbox = () => createLightbox(index, photographerMediaList, mediaItem);

      mediaItem.addEventListener('click', openMediaLightbox);
      mediaItem.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          openMediaLightbox();
        }
      });
    });
    // Listener likes
    const likeButtons = Array.from(document.getElementsByClassName('likeButton'));
    likeButtons.forEach((likeButton) => {
      likeButton.addEventListener('click', () => {
        const mediaId = Number(likeButton.getAttribute('data-mediaId'));
        handleMediaLike(mediaId, photographerMediaList);
      });
    });
    // Update
    updateTotalLikes();
    updateMediaList(photographerMediaList, currentSortMethod, photographerProfile);
  } else {
    console.log('Photographe non trouvé');
  }
}
createPhotographerPage();

/*
* Ouvre une lightbox pour afficher un média spécifique
* param number - Index du média cliqué
* param mediaList - Liste complète des médias du photographe
*/
function createLightbox(initialMediaIndex, mediaList, mediaItem) {
  // On recupère les data 
  const mediaId = Number(mediaItem.getAttribute('data-mediaId'));
  // Sélection des éléments principaux de l'interface
  const lightboxContainer = document.getElementById('lightbox');
  const lightboxMediaContainer = document.getElementById('mediaLightbox');
  const mainContainer = document.getElementById('main');
  const navigationArrowLeft = document.getElementById('leftArrow');
  const navigationArrowRight = document.getElementById('rightArrow');
  const closeLightboxButton = document.getElementById('closeLightbox');
  // Index du média actuellement affiché
  let currentMediaIndex = initialMediaIndex;
  /**
   * Affiche le média sélectionné dans la lightbox
   * param mediaIndex - Index du média à afficher
   */
  const displaySelectedMedia = (currentMediaIndex) => {
    const selectedMedia = mediaList[currentMediaIndex];
    const selectedMediaId = mediaId;
    // Trouve l'élément média correspondant dans le DOM
    const selectedMediaElement = document.querySelector(`.mediaElement[data-mediaId="${selectedMediaId}"]`);
    if (selectedMediaElement) {
      selectedMediaElement.tabIndex = 0;
      selectedMediaElement.focus();
      // Injecte le média dans la lightbox
      lightboxMediaContainer.innerHTML = selectedMediaElement.outerHTML;
      lightboxMediaContainer.innerHTML += '<p class="lightboxTitle">' + selectedMedia.title + '</p>';
    }
  };
  /* on masque l'overlay video */
  const overlays = document.querySelectorAll('.videoOverlay');
  overlays.forEach(overlay => {
    overlay.classList.add('videoOverlayHidden');
  });
  /**
   * Configure la navigation et l'accessibilité de la lightbox
   */
  const lightboxNav = () => {
    // Rend la lightbox visible et gère l'accessibilité
    mainContainer.setAttribute('aria-hidden', 'true');
    lightboxContainer.setAttribute('aria-hidden', 'false');
    lightboxContainer.style.display = 'block';
    const closeLightbox = document.getElementById('closeLightbox')
    closeLightbox.focus()

    // Définit les éléments focusables
    const focusableElements = lightboxContainer.querySelectorAll(
      '#leftArrow, #rightArrow, #closeLightbox'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Configuration du focus avec TAB
    const handleTabKeyNavigation = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };
    // Ajout des écouteurs d'événements pour la navigation
    lightboxContainer.addEventListener('keydown', handleTabKeyNavigation);
    // Navigation avec flèches gauche/droite et touches Enter
    lightboxContainer.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowLeft' || (event.key === 'Enter' && event.target === navigationArrowLeft)) {
        navigateMedia(-1);
      }
      if (event.key === 'ArrowRight' || (event.key === 'Enter' && event.target === navigationArrowRight)) {
        navigateMedia(1);
      }
    });
    // Navigation avec boutons de flèches
    navigationArrowLeft.addEventListener('click', () => navigateMedia(-1));
    navigationArrowLeft.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        navigateMedia(-1);
      }
    });
    navigationArrowRight.addEventListener('click', () => navigateMedia(1));
    navigationArrowRight.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        navigateMedia(1);
      }
    });
    function navigateMedia(direction) {
      // image précédente ou suivante
      currentMediaIndex = (currentMediaIndex + direction + mediaList.length) % mediaList.length
      const newMedia = mediaList[currentMediaIndex]
      const newMediaId = newMedia.id
      const newMediaElement = document.querySelector(`.mediaElement[data-mediaId="${newMediaId}"]`)
      const newMediaElementHTML = newMediaElement.outerHTML
      lightboxMediaContainer.innerHTML = newMediaElementHTML
      lightboxMediaContainer.innerHTML += '<p class="lightboxTitle">' + newMedia.title + '</p>';
    }
    // Fermeture de la lightbox
    const handleLightboxClose = () => {
      mainContainer.setAttribute('aria-hidden', 'false');
      lightboxContainer.setAttribute('aria-hidden', 'true');
      lightboxContainer.style.display = 'none';
        /* on replace l'overlay video */
      const overlays = document.querySelectorAll('.videoOverlay');
      overlays.forEach(overlay => {
      overlay.classList.remove('videoOverlayHidden');
  });
    };
    // Gestion de la fermeture avec bouton et touche Entrée
    closeLightboxButton.addEventListener('click', handleLightboxClose);
    closeLightboxButton.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        handleLightboxClose();
      }
    });
    // Fermeture avec touche Échap
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        handleLightboxClose();
      }
    });
  };
  // Initialisation de la lightbox
  displaySelectedMedia(initialMediaIndex);
  lightboxNav();
}


/**
 * Gère l'interaction avec le menu de sélection de filtre
 */
function filterMenu() {
  // Sélection des éléments du DOM
  const filterMenu = document.getElementsByClassName('selectMenu')[0];
  const selectButton = filterMenu.getElementsByClassName('selectBtn')[0];
  const filterOptions = Array.from(document.getElementsByClassName('optionItem'));
  const filterButtonText = filterMenu.getElementsByClassName('defaultFilterValue')[0];
  // Gestion du menu
  const menuVisibility = (forceClose = false) => {
    const isActive = filterMenu.classList.contains('active');
    const shouldActivate = forceClose ? false : !isActive;
    filterMenu.classList.toggle('active', shouldActivate);
    selectButton.setAttribute('aria-expanded', shouldActivate);
    if (shouldActivate) {
      filterOptions[0].focus();
    }
  };
  // Cache le filtre sélectionné dans la liste et maj le bouton
  const updateSelectedOption = (selectedIndex) => {
    filterOptions.forEach((option, index) => {
      const isSelected = index === selectedIndex;
      option.setAttribute('aria-selected', isSelected);
      if (isSelected) {
        option.setAttribute('hidden', 'true');
      } else {
        option.removeAttribute('hidden');
      }
    });
    // Met à jour le texte du bouton de filtre
    const selectedOptionText = filterOptions[selectedIndex]
      .getElementsByClassName('optionText')[0]
      .innerText;
    filterButtonText.innerText = selectedOptionText;
  };

  /**
   * Clavier entre les options du filtre
   * option - L'option actuellement focus
   * currentIndex - Index de l'option actuelle
   * event - L'événement clavier
   */
  const handleKeyboardNavigation = (option, currentIndex, event) => {
    switch (event.code) {
      case 'Enter':
        updateSelectedOption(currentIndex);
        menuVisibility(true);
        selectButton.focus();
        break;
      case 'ArrowUp':
        if (currentIndex > 0) {
          filterOptions[currentIndex - 1].focus();
        }
        break;
      case 'ArrowDown':
        if (currentIndex < filterOptions.length - 1) {
          filterOptions[currentIndex + 1].focus();
        }
        break;
      case 'Escape':
        menuVisibility(false);
        break;
    }
  };
  // Clic sur filtre on le masque
  selectButton.addEventListener('click', () => menuVisibility());

  // Gestion de l'ouverture du menu via clavier
  filterMenu.addEventListener('keyup', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
      menuVisibility();
    }
  });
  // Configuration des options
  filterOptions.forEach((option, index) => {
    option.setAttribute('tabindex', '0');

    option.addEventListener('click', () => {
      updateSelectedOption(index);
      menuVisibility(true);
    });

    option.addEventListener('keyup', (event) =>
      handleKeyboardNavigation(option, index, event)
    );
  });
}
// Initialisation du menu de filtre
filterMenu();