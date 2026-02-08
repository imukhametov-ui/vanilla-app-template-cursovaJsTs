// src/js/exercises.js
// Компонент для відображення каталогу вправ

import api from './api.js';

class Exercises {
  constructor(containerSelector, searchSelector) {
    this.container = document.querySelector(containerSelector);
    this.searchInput = document.querySelector(searchSelector);
    this.currentPage = 1;
    this.limit = 10;
    this.filters = {};
  }

  setupSearch() {
    // Не додаємо слухач тут, бо поле може ще не існувати
    // Замість цього додамо делегування подій на контейнер
  }

  setupFilterListener() {
    // Слухати події від filters.js
    document.addEventListener('filterSelected', (e) => {
      const { filter, name } = e.detail;
      console.log('Exercises received filter:', filter, name);
      
      // Встановити фільтри залежно від типу
      const filterParams = {};
      
      if (filter === 'Muscles') {
        filterParams.muscles = name;
      } else if (filter === 'Body parts') {
        filterParams.bodypart = name;
      } else if (filter === 'Equipment') {
        filterParams.equipment = name;
      }
      
      this.setFilters(filterParams);
    });
  }

  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
    this.currentPage = 1;
    this.loadExercises();
  }

  async loadExercises() {
    if (!this.container) return;

    try {
      this.container.innerHTML = '<div class="loader">Loading exercises...</div>';

      const params = {
        ...this.filters,
        page: this.currentPage,
        limit: this.limit,
      };

      const data = await api.getExercises(params);

      this.renderExercises(data.results);
      this.renderPagination(data.totalPages, data.page);
    } catch (error) {
      console.error('Failed to load exercises:', error);
      this.container.innerHTML = `
        <div class="error-message">
          <p>Failed to load exercises. Please try again.</p>
        </div>
      `;
    }
  }

  renderExercises(exercises) {
    if (!exercises || exercises.length === 0) {
      this.container.innerHTML = '<p>No exercises found</p>';
      return;
    }

    const exercisesHTML = exercises
      .map(
        exercise => `
        <div class="exercise-card" data-id="${exercise._id}">
          <div class="exercise-header">
            <div class="exercise-badge">WORKOUT</div>
            <div class="exercise-rating">
              ${this.renderStars(exercise.rating)}
              <span>${exercise.rating.toFixed(1)}</span>
            </div>
          </div>

          <div class="exercise-info">
            <button class="exercise-start-btn" data-id="${exercise._id}">
              Start
            </button>
          </div>

          <div class="exercise-title">
            <h3>${exercise.name}</h3>
          </div>

          <div class="exercise-details">
            <div class="detail-item">
              <span class="label">Burned calories:</span>
              <span class="value">${exercise.burnedCalories} / ${exercise.time} min</span>
            </div>
            <div class="detail-item">
              <span class="label">Body part:</span>
              <span class="value">${exercise.bodyPart}</span>
            </div>
            <div class="detail-item">
              <span class="label">Target:</span>
              <span class="value">${exercise.target}</span>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    this.container.innerHTML = `<div class="exercises-grid">${exercisesHTML}</div>`;

    this.container.querySelectorAll('.exercise-start-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this.handleStartClick(e.target.closest('[data-id]').dataset.id);
      });
    });
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

  renderPagination(totalPages, currentPage) {
    if (totalPages <= 1) return;

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    let paginationHTML = '';

    if (currentPage > 1) {
      paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">←</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        paginationHTML += `
          <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
            ${i}
          </button>
        `;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        paginationHTML += '<span class="pagination-dots">...</span>';
      }
    }

    if (currentPage < totalPages) {
      paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">→</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
    this.container.appendChild(paginationContainer);

    paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        this.currentPage = parseInt(e.target.dataset.page);
        this.loadExercises();
      });
    });
  }

  handleStartClick(exerciseId) {
    if (this.onExerciseSelect) {
      this.onExerciseSelect(exerciseId);
    }
  }

  init() {
    this.setupSearch();
    this.setupFilterListener(); // ДОДАНО
    // НЕ викликаємо loadExercises() - чекаємо filterSelected
  }
}

export default Exercises;