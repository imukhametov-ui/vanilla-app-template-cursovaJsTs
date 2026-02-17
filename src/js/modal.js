// Modal management functions
export const openModal = modalId => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.showModal();

    // Add backdrop click listener if not already attached
    // Use mousedown + click to prevent closing when selecting text
    if (modal.dataset.backdropListener !== 'true') {
      let mouseDownTarget = null;

      modal.addEventListener('mousedown', e => {
        mouseDownTarget = e.target;
      });

      modal.addEventListener('click', e => {
        // Only close if both mousedown and click happened on the backdrop
        if (e.target === modal && mouseDownTarget === modal) {
          modal.close();
        }
        mouseDownTarget = null;
      });

      modal.dataset.backdropListener = 'true';
    }
  }
};

export const closeModal = modalId => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.close();
  }
};

// Render exercise details in modal
export const renderExerciseModal = exercise => {
  if (!exercise) return;

  // Update GIF
  const gifElement = document.getElementById('modal-exercise-gif');
  if (gifElement) {
    gifElement.src = exercise.gifUrl || '';
    gifElement.alt = exercise.name || 'Exercise';
  }

  // Update title
  const titleElement = document.getElementById('modal-exercise-title');
  if (titleElement) {
    titleElement.textContent = exercise.name || 'Exercise';
  }

  // Update rating
  const ratingElement = document.getElementById('modal-exercise-rating');
  if (ratingElement) {
    const rating = exercise.rating || 0;
    const fullStars = Math.floor(rating);

    ratingElement.innerHTML = `
      <span class="rating-value">${rating.toFixed(1)}</span>
      <div class="rating-stars">
        ${Array.from({ length: 5 }, (_, i) => {
          const filled = i < fullStars ? 'filled' : '';
          return `<svg class="star ${filled}" width="18" height="18" aria-hidden="true">
            <use href="#icon-star"></use>
          </svg>`;
        }).join('')}
      </div>
    `;
  }

  // Update details
  const targetElement = document.getElementById('modal-target');
  if (targetElement) targetElement.textContent = exercise.target || 'N/A';

  const bodyPartElement = document.getElementById('modal-bodypart');
  if (bodyPartElement) bodyPartElement.textContent = exercise.bodyPart || 'N/A';

  const equipmentElement = document.getElementById('modal-equipment');
  if (equipmentElement) equipmentElement.textContent = exercise.equipment || 'N/A';

  const popularElement = document.getElementById('modal-popular');
  if (popularElement) popularElement.textContent = exercise.popularity || '0';

  const caloriesElement = document.getElementById('modal-calories');
  if (caloriesElement) {
    caloriesElement.textContent = `${exercise.burnedCalories || 0}/${exercise.time || 0} min`;
  }

  // Update description
  const descriptionElement = document.getElementById('modal-description');
  if (descriptionElement) {
    descriptionElement.textContent = exercise.description || 'No description available.';
  }

  // Store exercise ID for later use (favorites, rating)
  const modal = document.getElementById('exercise-modal');
  if (modal) {
    modal.dataset.exerciseId = exercise._id;
  }
};

// Store exerciseId when opening rating modal to reopen exercise modal later
let currentExerciseIdForRating = null;

// Show rating modal (close exercise modal, reopen it when rating closes)
export const showRatingModal = exerciseId => {
  const ratingModal = document.getElementById('rating-modal');

  // Store exerciseId to reopen exercise modal later
  currentExerciseIdForRating = exerciseId;

  // Close exercise modal first
  closeModal('exercise-modal');

  // Add close event listener once to reset form and reopen exercise modal
  if (ratingModal && ratingModal.dataset.closeListener !== 'true') {
    ratingModal.addEventListener('close', () => {
      resetRatingForm();
      // Reopen exercise modal with stored ID
      if (currentExerciseIdForRating) {
        reopenExerciseModal(currentExerciseIdForRating);
        currentExerciseIdForRating = null;
      }
    });
    ratingModal.dataset.closeListener = 'true';
  }

  openModal('rating-modal');
  resetRatingForm();
  initRatingStars();
};

// Reopen exercise modal without fetching data again (it's already in DOM)
const reopenExerciseModal = () => {
  openModal('exercise-modal');
};

// Hide rating modal and return to exercise modal
export const hideRatingModal = () => {
  closeModal('rating-modal');
};

// Reset rating form
const resetRatingForm = () => {
  const ratingForm = document.getElementById('rating-form');
  const ratingValue = document.getElementById('rating-display-value');

  if (ratingForm) ratingForm.reset();
  if (ratingValue) ratingValue.textContent = '0.0';
};

// Initialize rating stars interaction
export const initRatingStars = () => {
  const starsContainer = document.getElementById('rating-stars');
  const ratingValue = document.getElementById('rating-display-value');

  if (!starsContainer) return;

  // Check if already has listener to prevent duplicates
  if (starsContainer.dataset.listenerAttached === 'true') return;
  starsContainer.dataset.listenerAttached = 'true';

  // Update rating display when radio changes
  starsContainer.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      const selectedRating = parseFloat(e.target.value);
      if (ratingValue) {
        ratingValue.textContent = selectedRating.toFixed(1);
      }
    }
  });
};

// Get current rating value from radio buttons
export const getCurrentRating = () => {
  const checkedRadio = document.querySelector('#rating-stars input[name="rating"]:checked');
  return checkedRadio ? parseFloat(checkedRadio.value) : 0;
};