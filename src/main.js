// src/main.js
import './css/styles.css';

import QuoteOfTheDay from './js/quote.js';
import Filters from './js/filters.js';
import Exercises from './js/exercises.js';
import ExerciseModal from './js/modal.js';
import Subscription from './js/subscription.js';
import { initHeader } from './js/header.js';

class App {
  constructor() {
    this.quote = null;
    this.filters = null;
    this.exercises = null;
    this.subscription = null;
    
    this.filterSection = document.querySelector('.filters-section');
    this.exercisesSection = document.querySelector('.exercises-section');
    this.categoryName = document.querySelector('#category-name');
  }

  init() {
    console.log('App initialized');

    initHeader();

    this.quote = new QuoteOfTheDay('#quote-container');
    this.quote.init();

    this.filters = new Filters('#filter-tabs', '#filter-content');
    
    this.filters.onFilterSelect = (filterData) => {
      this.showExercisesSection(filterData);
    };
    
    this.filters.init();

    this.exercises = new Exercises('#exercises-container', '#search-input');
    
    this.exercises.onExerciseSelect = (exerciseId) => {
      ExerciseModal.open(exerciseId);
    };

    this.subscription = new Subscription('#subscription-form');
    this.subscription.init();
  }

  showExercisesSection(filterData) {
  if (this.filterSection) {
    this.filterSection.style.display = 'none';
  }
  
  if (this.exercisesSection) {
    this.exercisesSection.style.display = 'block';
  }

  if (this.categoryName) {
    this.categoryName.textContent = `/ ${filterData.name}`;
  }

  const params = {};
  
  if (filterData.type === 'Muscles') {
    params.muscles = filterData.name;
  } else if (filterData.type === 'Body parts') {
    params.bodypart = filterData.name;
  } else if (filterData.type === 'Equipment') {
    params.equipment = filterData.name;
  }
  
  this.exercises.setFilters(params);
  
  // ДОДАТИ ЦЕЙ КОД:
  setTimeout(() => {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const keyword = e.target.value.trim();
          
          if (keyword === '') {
            delete this.exercises.filters.keyword;
          } else {
            this.exercises.filters.keyword = keyword;
          }
          
          this.exercises.currentPage = 1;
          this.exercises.loadExercises();
        }
      });
    }
  }, 100);
}
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});