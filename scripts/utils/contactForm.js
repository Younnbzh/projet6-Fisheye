// Modal contact
function popupContact() {
  const mainContent = document.getElementById('main');
  const modal = document.getElementById('contactModal');
  // Accessibilité de la modal
  mainContent.setAttribute('aria-hidden', 'true');
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'block';

  // Focus sur le premier champ
  document.getElementById('firstName').focus();

  // Sélectionner tous les éléments focusables
  const focusableElements = modal.querySelectorAll('input:not([disabled]), textarea, button, select, #closeBtn');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Gérer la navigation au clavier avec tab dans la modal
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      // Si Shift+Tab sur le premier élément, aller au dernier
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Si Tab sur le dernier élément, aller au premier
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Fermer la modal si la touche Échap est pressée
document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    closePopup();
  }
});


function closePopup() {
  const mainContent = document.getElementById('main');
  const modal = document.getElementById('contactModal');
  // accessibilité et masquer la modal
  mainContent.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  // focus sur le bouton d'ouverture
  const contactButton = document.getElementById('contactBtn');
  contactButton.focus();
}

function setupPopupInteractions() {
  const contactButton = document.getElementById('contactBtn');
  const closeButton = document.getElementById('closeButton');
  // Ajouter les écouteurs d'événements
  contactButton.addEventListener('click', popupContact);
  closeButton.addEventListener('click', closePopup);
  closeButton.addEventListener('keyup', (event) => {
    // Fermer la modal avec la touche Entrée
    if (event.key === 'Enter') {
      closePopup();
    }
  });
}
// Contrôle formulaire de contact
function validateContactForm(event) {
  event.preventDefault();

  const formFields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
  };

  // Vérifie que tous les champs sont remplis
  const isFormValid = Object.values(formFields).every(field => field.value.trim() !== '');
  if (!isFormValid) {
    console.log('Merci de remplir les champs.');
    return;
  }
  console.log('Prénom:', formFields.firstName.value)
  console.log('Nom:', formFields.lastName.value)
  console.log('Email:', formFields.email.value)
  console.log('Message:', formFields.message.value)
  submitForm();
}
// Envoi formulaire
function submitForm() {
  console.log('Formulaire envoyé');
  document.getElementById('contactForm').reset();
}
document.getElementById('submitButton').addEventListener('click', validateContactForm);

export { popupContact, closePopup, setupPopupInteractions }