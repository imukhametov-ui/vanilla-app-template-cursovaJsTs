// src/favorites-page.js
import './css/styles.css';

import QuoteOfTheDay from './js/quote.js';
import Subscription from './js/subscription.js';
import favoritesManager from './js/favorites.js';
import { initHeader } from './js/header.js';

class FavoritesPageApp {
  constructor() {
    this.quote = null;
    this.subscription = null;
  }

  init() {
    console.log('Favorites page initialized');

    initHeader();

    this.quote = new QuoteOfTheDay('#quote-container');
    this.quote.init();

    favoritesManager.init();

    this.subscription = new Subscription('#subscription-form');
    this.subscription.init();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const favoritesPage = new FavoritesPageApp();
  favoritesPage.init();
});