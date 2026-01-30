// src/favorites-page.js
// JS для сторінки favorites.html

import './css/styles.css';

import QuoteOfTheDay from './js/quote.js';
import Subscription from './js/subscription.js';
import favoritesManager from './js/favorites.js';
import { initHeader } from './js/header.js';

// Ініціалізація сторінки Favorites
class FavoritesPageApp {
  constructor() {
    this.quote = null;
    this.subscription = null;
  }

  init() {
    console.log('Favorites page initialized');

    // Ініціалізація Header
    initHeader();

    // Ініціалізація цитати дня
    this.quote = new QuoteOfTheDay('#quote-container');
    this.quote.init();

    // Ініціалізація списку улюблених
    favoritesManager.init();

    // Ініціалізація підписки в footer
    this.subscription = new Subscription('#subscription-form');
    this.subscription.init();
  }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  const favoritesPage = new FavoritesPageApp();
  favoritesPage.init();
});