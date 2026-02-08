// src/js/quote.js
// Компонент для відображення цитати дня з кешуванням

import api from './api.js';

class QuoteOfTheDay {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.storageKey = 'dailyQuote';
  }

  async render() {
    if (!this.container) {
      console.error('Quote container not found');
      return;
    }

    try {
      this.container.innerHTML = '<div class="loader">Loading...</div>';
      const quoteData = await this.getQuote();
      
      this.container.innerHTML = `
        <div class="quote-card">
    <h3 class="quote-title">Quote of the day</h3>
    <p class="quote-text">${quoteData.quote}</p>
    <p class="quote-author">${quoteData.author}</p>
  </div>
`;
    } catch (error) {
      console.error('Failed to load quote:', error);
      this.container.innerHTML = `
        <div class="error-message">
          <p>Failed to load quote.</p>
        </div>
      `;
    }
  }

  async getQuote() {
    const cached = this.getCachedQuote();
    if (cached) return cached;

    const freshQuote = await api.getQuote();
    this.cacheQuote(freshQuote);
    return freshQuote;
  }

  getCachedQuote() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;

      const { quote, author, date } = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];

      if (date === today) {
        return { quote, author };
      }

      localStorage.removeItem(this.storageKey);
      return null;
    } catch (error) {
      return null;
    }
  }

  cacheQuote(quoteData) {
    try {
      const dataToStore = {
        quote: quoteData.quote,
        author: quoteData.author,
        date: new Date().toISOString().split('T')[0],
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error caching quote:', error);
    }
  }

  init() {
    this.render();
  }
}

export default QuoteOfTheDay;