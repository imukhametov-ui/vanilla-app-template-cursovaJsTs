// Favorites Page
// Сторінка — "диригент", збирає все разом

import { loadTemplate, replacePlaceholders, runAfterLoad } from './dom.js';
import { initQuote } from './quote.js';
import { renderPagination, setupPagination } from './pagination.js';
import { openExerciseModal } from './exercise-controller.js';
import { getFavoriteIds, removeFavorite } from './favorites-service.js';
import { getExerciseById } from './api.js';
import { BREAKPOINTS, LIMITS, DEBOUNCE_MS } from './constants.js';

// Re-export service functions for other modules
export { getFavoriteIds, addFavorite, removeFavorite, isFavorite, toggleFavorite } from './favorites-service.js';

// Page state
const state = {
  page: 1,
  exercises: [], // Cached exercises data from API
};

// Get items per page based on screen width
function getPerPage() {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.DESKTOP) return Infinity;
  if (width >= BREAKPOINTS.TABLET) return LIMITS.EXERCISES_TABLET;
  return LIMITS.EXERCISES_MOBILE;
}

// Check if we should use pagination
function usePagination() {
  return window.innerWidth < BREAKPOINTS.DESKTOP;
}

// Render empty state
async function renderEmptyState(container) {
  const template = await loadTemplate('favorites-empty');
  container.innerHTML = template;
}

// Fetch exercises data from API
async function fetchFavoritesData() {
  const favoriteIds = getFavoriteIds();

  if (favoriteIds.length === 0) {
    state.exercises = [];
    return;
  }

  // Fetch all exercises in parallel
  const exercisePromises = favoriteIds.map(async (id) => {
    try {
      return await getExerciseById(id);
    } catch (err) {
      console.error(`Failed to fetch exercise ${id}:`, err);
      // Remove invalid ID from favorites
      removeFavorite(id);
      return null;
    }
  });

  const exercises = await Promise.all(exercisePromises);
  state.exercises = exercises.filter(Boolean); // Remove nulls
}

// Render favorites list
async function renderFavorites() {
  const container = document.getElementById('favorites-container');
  if (!container) return;

  const paginationContainer = document.getElementById('favorites-pagination');

  if (state.exercises.length === 0) {
    await renderEmptyState(container);
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
    }
    return;
  }

  const perPage = getPerPage();
  const shouldPaginate = usePagination();
  const totalPages = shouldPaginate ? Math.ceil(state.exercises.length / perPage) : 1;

  if (state.page > totalPages) {
    state.page = totalPages;
  }

  const startIndex = shouldPaginate ? (state.page - 1) * perPage : 0;
  const endIndex = shouldPaginate ? startIndex + perPage : state.exercises.length;
  const favorites = state.exercises.slice(startIndex, endIndex);

  const cardTemplate = await loadTemplate('exercise-card');

  const cardsHtml = favorites
    .map(exercise => {
      return replacePlaceholders(cardTemplate, {
        id: exercise._id,
        name: exercise.name,
        burnedCalories: exercise.burnedCalories || 0,
        time: exercise.time || 0,
        bodyPart: exercise.bodyPart || 'N/A',
        target: exercise.target || 'N/A',
        rating: exercise.rating || 0,
        ratingFormatted: exercise.rating ? exercise.rating.toFixed(1) : '0.0',
        cardClass: 'is-favorite',
      });
    })
    .join('');

  container.className = 'favorites-grid';
  container.innerHTML = cardsHtml;

  if (shouldPaginate) {
    renderPagination(state.page, totalPages, 'favorites-pagination');
  } else if (paginationContainer) {
    paginationContainer.innerHTML = '';
  }
}

// Handle page change
function handlePageChange(newPage) {
  if (newPage && newPage !== state.page) {
    state.page = newPage;
    renderFavorites();
  }
}

// Setup resize listener
function setupResizeListener() {
  let timeoutId;
  let currentPerPage = getPerPage();

  window.addEventListener('resize', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const newPerPage = getPerPage();
      if (newPerPage !== currentPerPage) {
        currentPerPage = newPerPage;
        state.page = 1;
        renderFavorites();
      }
    }, DEBOUNCE_MS);
  });
}

// Setup event delegation for favorites container
function setupEventHandlers() {
  const container = document.getElementById('favorites-container');
  if (!container) return;

  if (container.dataset.listenerAttached === 'true') return;
  container.dataset.listenerAttached = 'true';

  container.addEventListener('click', async (e) => {
    // Delete button
    const deleteBtn = e.target.closest('.favorite-delete-btn');
    if (deleteBtn) {
      e.stopPropagation();
      const exerciseId = deleteBtn.dataset.id;
      if (exerciseId) {
        removeFavorite(exerciseId);
        // Remove from cached state
        state.exercises = state.exercises.filter(ex => ex._id !== exerciseId);
        await renderFavorites();
      }
      return;
    }

    // Start button
    const startBtn = e.target.closest('.exercise-start-btn');
    if (startBtn) {
      e.stopPropagation();
      const exerciseId = startBtn.dataset.id;
      if (!exerciseId) return;

      await openExerciseModal(exerciseId, {
        isFavoritesPage: true,
        onRemoveFavorite: async () => {
          state.exercises = state.exercises.filter(ex => ex._id !== exerciseId);
          await renderFavorites();
        },
      });
    }
  });
}

// Initialize favorites page
export function initFavoritesPage() {
  const favoritesPage = document.querySelector('.favorites-page');

  // Setup event listeners immediately (sync - critical for interactivity)
  setupEventHandlers();
  setupPagination(handlePageChange, 'favorites-pagination');
  setupResizeListener();

  // Mark as loaded immediately
  if (favoritesPage) {
    favoritesPage.classList.add('loaded');
  }

  // Defer async operations (non-critical for initial render)
  runAfterLoad(async () => {
    try {
      await initQuote();
      await fetchFavoritesData();
      await renderFavorites();
    } catch (err) {
      console.error('Error initializing favorites page:', err);
    }
  });
}