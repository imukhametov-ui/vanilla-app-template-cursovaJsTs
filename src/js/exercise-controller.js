// Exercise Modal Handler
// Відповідає за обробку подій модалки вправи

import { getExerciseById, updateRating } from './api.js';
import {
  openModal,
  closeModal,
  renderExerciseModal,
  showRatingModal,
  hideRatingModal,
  getCurrentRating,
} from './modal.js';
import { renderExerciseSkeleton } from './dom.js';
import { addFavorite, removeFavorite, isFavorite } from './favorites-service.js';
import { notify } from './notify.js';

// Open exercise modal with skeleton and fetch
export async function openExerciseModal(exerciseId, options = {}) {
  openModal('exercise-modal');
  renderExerciseSkeleton();

  try {
    const exercise = await getExerciseById(exerciseId);
    renderExerciseModal(exercise);
    setupExerciseModalHandlers(exerciseId, options);
  } catch (err) {
    console.error(`Failed to fetch exercise details for ${exerciseId}:`, err);
    closeModal('exercise-modal');
  }
}

// Setup exercise modal event handlers
function setupExerciseModalHandlers(exerciseId, options = {}) {
  const { onRemoveFavorite, isFavoritesPage = false } = options;

  // Close button
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.onclick = () => closeModal('exercise-modal');
  }

  // Rating button
  const giveRatingBtn = document.getElementById('give-rating-btn');
  if (giveRatingBtn) {
    giveRatingBtn.onclick = () => {
      showRatingModal(exerciseId);
      setupRatingModalHandlers(exerciseId);
    };
  }

  // Favorites button
  const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
  if (addToFavoritesBtn) {
    const updateFavoriteButton = () => {
      if (isFavorite(exerciseId)) {
        addToFavoritesBtn.innerHTML = `
          <span class="btn-text">Remove from favorites</span>
          <svg width="20" height="20" aria-hidden="true">
            <use href="#icon-trash"></use>
          </svg>
        `;
      } else {
        addToFavoritesBtn.innerHTML = `
          <span class="btn-text">Add to favorites</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 3.5C10 3.5 6.5 1 3.5 3.5C0.5 6 2 10 10 16.5C18 10 19.5 6 16.5 3.5C13.5 1 10 3.5 10 3.5Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        `;
      }
    };

    addToFavoritesBtn.onclick = () => {
      if (isFavorite(exerciseId)) {
        removeFavorite(exerciseId);
        if (isFavoritesPage) {
          closeModal('exercise-modal');
          if (onRemoveFavorite) onRemoveFavorite();
        } else {
          updateFavoriteButton();
        }
      } else {
        addFavorite(exerciseId);
        updateFavoriteButton();
      }
    };

    updateFavoriteButton();
  }
}

// Setup rating modal event handlers
function setupRatingModalHandlers(exerciseId) {
  const closeBtn = document.getElementById('rating-modal-close-btn');
  if (closeBtn) {
    closeBtn.onclick = () => hideRatingModal();
  }

  const ratingForm = document.getElementById('rating-form');
  if (ratingForm) {
    ratingForm.onsubmit = async e => {
      e.preventDefault();

      if (!ratingForm.checkValidity()) {
        ratingForm.reportValidity();
        return;
      }

      const rating = getCurrentRating();
      const email = ratingForm.email.value.trim();
      const review = ratingForm.review?.value.trim() || '';

      try {
        await updateRating(exerciseId, rating, email, review);
        hideRatingModal();
        notify.success('Rating submitted successfully!');
      } catch (err) {
        if (err.response?.status === 409) {
          notify.error('You have already rated this exercise.');
        } else {
          notify.error('Failed to submit rating. Please try again.');
        }
        console.error('Failed to submit rating:', err);
      }
    };
  }
}