// src/main.js
// Головний файл для index.html

import './css/styles.css';

// Імпортуємо всі компоненти
import './js/api.js';
import QuoteOfTheDay from './js/quote.js';
import Filters from './js/filters.js';
import Exercises from './js/exercises.js';
import ExerciseModal from './js/modal.js';
import Subscription from './js/subscription.js';
import { initHeader } from './js/header.js';

// Ініціалізація застосунку
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

    // Ініціалізація Header (мобільне меню)
    initHeader();

    // Ініціалізація цитати дня
    this.quote = new QuoteOfTheDay('#quote-container');
    this.quote.init();

    // Ініціалізація фільтрів
    this.filters = new Filters('#filter-tabs', '#filter-content');
    
    // Callback коли користувач обирає категорію
    this.filters.onFilterSelect = (filterData) => {
      this.showExercisesSection(filterData);
    };
    
    this.filters.init();

    // Ініціалізація каталогу вправ
    this.exercises = new Exercises('#exercises-container', '#search-input');
    
    // Callback коли користувач клікає Start
    this.exercises.onExerciseSelect = (exerciseId) => {
      ExerciseModal.open(exerciseId);
    };

    // Ініціалізація підписки в footer
    this.subscription = new Subscription('#subscription-form');
    this.subscription.init();
  }

  showExercisesSection(filterData) {
    // Приховуємо секцію фільтрів
    if (this.filterSection) {
      this.filterSection.style.display = 'none';
    }
    
    // Показуємо секцію вправ
    if (this.exercisesSection) {
      this.exercisesSection.style.display = 'block';
    }

    // Оновлюємо назву категорії
    if (this.categoryName) {
      this.categoryName.textContent = `/ ${filterData.name}`;
    }

    // Налаштовуємо фільтр для вправ
    const params = {};
    
    if (filterData.type === 'Muscles') {
      params.muscles = filterData.name;
    } else if (filterData.type === 'Body parts') {
      params.bodypart = filterData.name;
    } else if (filterData.type === 'Equipment') {
      params.equipment = filterData.name;
    }
    
    this.exercises.setFilters(params);
  }
}

// Запуск застосунку після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});