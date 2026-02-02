// src/js/favorites.js
// Компонент сторінки Favorites

import ExerciseModal from './modal.js';

class FavoritesPage {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.favorites = this.loadFavorites();
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  addToFavorites(exercise) {
    const exists = this.favorites.some(fav => fav._id === exercise._id);
    if (!exists) {
      this.favorites.push(exercise);
      this.saveFavorites();
      return true;
    }
    return false;
  }

  removeFromFavorites(exerciseId) {
    this.favorites = this.favorites.filter(fav => fav._id !== exerciseId);
    this.saveFavorites();
    this.render();
  }

  isFavorite(exerciseId) {
    return this.favorites.some(fav => fav._id === exerciseId);
  }

  render() {
    if (!this.container) return;

    if (this.favorites.length === 0) {
      this.container.innerHTML = `
        <div class="empty-favorites">
          <h2>Your favorites list is empty</h2>
          <p>Add exercises you like to this list and they will be saved here</p>
          <a href="/index.html" class="btn-primary">Browse Exercises</a>
        </div>
      `;
      return;
    }

    const favoritesHTML = this.favorites
      .map(
        exercise => `
        <div class="favorite-card" data-id="${exercise._id}">
          <div class="favorite-header">
            <div class="favorite-badge">WORKOUT</div>
            <button class="remove-favorite-btn" data-id="${exercise._id}" aria-label="Remove from favorites">
              ✕
            </button>
          </div>
          
          <div class="favorite-content">
            <button class="favorite-start-btn" data-id="${exercise._id}">
              Start
            </button>
          </div>
          
          <h3 class="favorite-title">${exercise.name}</h3>
          
          <div class="favorite-details">
            <div class="detail-row">
              <span class="label">Burned calories:</span>
              <span class="value">${exercise.burnedCalories} / ${exercise.time} min</span>
            </div>
            <div class="detail-row">
              <span class="label">Body part:</span>
              <span class="value">${exercise.bodyPart}</span>
            </div>
            <div class="detail-row">
              <span class="label">Target:</span>
              <span class="value">${exercise.target}</span>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    this.container.innerHTML = `
      <div class="favorites-grid">
        ${favoritesHTML}
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.container.querySelectorAll('.favorite-start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const exerciseId = e.currentTarget.dataset.id;
        ExerciseModal.open(exerciseId);
      });
    });

    this.container.querySelectorAll('.remove-favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const exerciseId = e.currentTarget.dataset.id;
        
        if (confirm('Remove this exercise from favorites?')) {
          this.removeFromFavorites(exerciseId);
        }
      });
    });
  }

  init() {
    this.render();
  }
}

const favoritesManager = new FavoritesPage('#favorites-container');

export default favoritesManager;
export { FavoritesPage };