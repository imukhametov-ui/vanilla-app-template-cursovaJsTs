import { getQuote } from './api.js';
import { renderQuote } from './dom.js';
import { STORAGE_KEYS } from './constants.js';

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get cached quote from localStorage
 */
function getCachedQuote() {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.QUOTE);
    if (!cached) return null;

    const { quote, author, date } = JSON.parse(cached);
    const today = getTodayDate();

    if (date === today) {
      return { quote, author };
    }

    localStorage.removeItem(STORAGE_KEYS.QUOTE);
    return null;
  } catch (error) {
    console.error('Error reading cached quote:', error);
    return null;
  }
}

/**
 * Save quote to localStorage
 */
function cacheQuote(quote, author) {
  try {
    const data = {
      quote,
      author,
      date: getTodayDate(),
    };
    localStorage.setItem(STORAGE_KEYS.QUOTE, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching quote:', error);
  }
}

/**
 * Initialize Quote of the Day
 * Checks cache first, otherwise fetches from API
 */
export async function initQuote() {
  try {
    let quoteData = getCachedQuote();

    if (!quoteData) {
      quoteData = await getQuote();
      cacheQuote(quoteData.quote, quoteData.author);
    }

    renderQuote(quoteData);
  } catch (err) {
    console.error('Failed to initialize quote:', err);
  }
}