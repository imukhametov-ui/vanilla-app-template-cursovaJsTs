// src/js/modal.js
// Модальне вікно для детальної інформації про вправу

import api from './api.js';
import favoritesManager from './favorites.js';

class ExerciseModal {
  constructor() {
    this.modal = null;
    this.currentExerciseId = null;
    this.currentExercise = null;
  }

  createModal() {
    if (this.modal) return;

    this.modal = document.createElement('div');
    this.modal.className = 'modal-backdrop';
    this.modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">×</button>
        <div class="modal-body"></div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modal.querySelector('.modal-close').addEventListener('click', () => {
      this.close();
    });

    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  async open(exerciseId) {
    this.createModal();
    this.currentExerciseId = exerciseId;

    const modalBody = this.modal.querySelector('.modal-body');
    modalBody.innerHTML = '<div class="loader">Loading...</div>';

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
      const exercise = await api.getExerciseById(exerciseId);
      this.currentExercise = exercise;
      this.renderExerciseDetails(exercise);
    } catch (error) {
      console.error('Failed to load exercise details:', error);
      modalBody.innerHTML = `
        <div class="error-message">
          <p>Failed to load exercise details.</p>
        </div>
      `;
    }
  }

  renderExerciseDetails(exercise) {
    const modalBody = this.modal.querySelector('.modal-body');
    const isFavorite = favoritesManager.isFavorite(exercise._id);
    
    modalBody.innerHTML = `
      <div class="exercise-details-modal">
        <div class="exercise-video">
          ${exercise.gifUrl ? `<img src="${exercise.gifUrl}" alt="${exercise.name}" />` : ''}
        </div>
        
        <div class="exercise-info-detailed">
          <h2>${exercise.name}</h2>
          
          <div class="exercise-rating-section">
            <div class="rating-display">
              ${this.renderStars(exercise.rating)}
              <span>${exercise.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div class="exercise-specs">
            <div class="spec-item">
              <span class="label">Target</span>
              <span class="value">${exercise.target}</span>
            </div>
            <div class="spec-item">
              <span class="label">Body Part</span>
              <span class="value">${exercise.bodyPart}</span>
            </div>
            <div class="spec-item">
              <span class="label">Equipment</span>
              <span class="value">${exercise.equipment}</span>
            </div>
            <div class="spec-item">
              <span class="label">Popular</span>
              <span class="value">${exercise.popularity}</span>
            </div>
            <div class="spec-item">
              <span class="label">Burned Calories</span>
              <span class="value">${exercise.burnedCalories} / ${exercise.time} min</span>
            </div>
          </div>
          
          <div class="exercise-description">
            <p>${exercise.description || 'No description available.'}</p>
          </div>
          
          <div class="modal-actions">
            <button class="btn-favorite ${isFavorite ? 'is-favorite' : ''}" data-id="${exercise._id}">
              ${isFavorite ? 'Remove from' : 'Add to'} Favorites
            </button>
            
            <button class="btn-rating">Give a rating</button>
          </div>
        </div>
      </div>
    `;

    this.setupFavoriteButton();
    this.setupRating();
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML += '<span class="star full">★</span>';
      } else if (i === fullStars && hasHalfStar) {
        starsHTML += '<span class="star half">★</span>';
      } else {
        starsHTML += '<span class="star empty">☆</span>';
      }
    }

    return starsHTML;
  }

  setupFavoriteButton() {
    const favoriteBtn = this.modal.querySelector('.btn-favorite');
    if (!favoriteBtn) return;

    favoriteBtn.addEventListener('click', () => {
      const exerciseId = favoriteBtn.dataset.id;
      const isFavorite = favoritesManager.isFavorite(exerciseId);

      if (isFavorite) {
        favoritesManager.removeFromFavorites(exerciseId);
        favoriteBtn.classList.remove('is-favorite');
        favoriteBtn.textContent = 'Add to Favorites';
      } else {
        favoritesManager.addToFavorites(this.currentExercise);
        favoriteBtn.classList.add('is-favorite');
        favoriteBtn.textContent = 'Remove from Favorites';
      }
    });
  }

  setupRating() {
    const ratingBtn = this.modal.querySelector('.btn-rating');
    if (!ratingBtn) return;

    ratingBtn.addEventListener('click', () => {
      this.openRatingModal();
    });
  }

  openRatingModal() {
    const ratingModal = document.createElement('div');
    ratingModal.className = 'modal-backdrop rating-modal';
    ratingModal.innerHTML = `
      <div class="modal-content modal-rating-content">
        <button class="modal-close" aria-label="Close modal">×</button>
        <div class="modal-body">
          <h3>Rate this exercise</h3>
          <p>Choose your rating from 1 to 5</p>
          
          <form class="rating-form">
            <div class="rating-stars">
              ${[1, 2, 3, 4, 5]
                .map(
                  star => `
                <label class="rating-star-label">
                  <input type="radio" name="rating" value="${star}" required />
                  <span class="star">☆</span>
                </label>
              `
                )
                .join('')}
            </div>
            
            <input 
              type="email" 
              name="email"
              placeholder="Your email"
              required
              pattern="^\\w+(\\.\\w+)?@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
              class="rating-email"
            />
            
            <button type="submit" class="btn-submit-rating">Send</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(ratingModal);
    this.modal.classList.remove('active');
    ratingModal.classList.add('active');

    const stars = ratingModal.querySelectorAll('.rating-star-label');
    const radioInputs = ratingModal.querySelectorAll('input[type="radio"]');
    
    radioInputs.forEach((radio, index) => {
      radio.addEventListener('change', () => {
        stars.forEach((star, i) => {
          const starIcon = star.querySelector('.star');
          if (i <= index) {
            starIcon.textContent = '★';
            starIcon.classList.add('filled');
          } else {
            starIcon.textContent = '☆';
            starIcon.classList.remove('filled');
          }
        });
      });
    });

    const form = ratingModal.querySelector('.rating-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const selectedRating = form.querySelector('input[name="rating"]:checked');
  if (!selectedRating) {
    alert('Please select a rating');
    return;
  }
  
  const rating = parseInt(selectedRating.value);
  const submitBtn = form.querySelector('.btn-submit-rating');
      
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        await api.rateExercise(this.currentExerciseId, rating);
        
        ratingModal.remove();
        this.modal.classList.add('active');
        alert('Thank you for your rating!');
      } catch (error) {
        console.error('Failed to submit rating:', error);
        alert('Failed to submit rating. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      }
    });

    const closeBtn = ratingModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      ratingModal.remove();
      this.modal.classList.add('active');
    });

    ratingModal.addEventListener('click', (e) => {
      if (e.target === ratingModal) {
        ratingModal.remove();
        this.modal.classList.add('active');
      }
    });
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
      this.currentExerciseId = null;
    }
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  }
}

export default new ExerciseModal();