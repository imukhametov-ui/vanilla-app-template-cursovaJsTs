// Favorites Service - localStorage operations
// Зберігає тільки ID вправ, дані завантажуються з API

import { STORAGE_KEYS } from './constants.js';

// Migrate old format (objects) to new format (IDs only)
function migrateOldFormat(data) {
  if (!Array.isArray(data) || data.length === 0) return data;

  // Check if first item is an object (old format)
  if (typeof data[0] === 'object' && data[0]._id) {
    // Extract IDs from objects
    const ids = data.map(item => item._id).filter(Boolean);
    // Save migrated data
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(ids));
    return ids;
  }

  return data;
}

// Get all favorite IDs from localStorage
export function getFavoriteIds() {
  try {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!favorites) return [];

    const parsed = JSON.parse(favorites);
    return migrateOldFormat(parsed);
  } catch (err) {
    console.error('Failed to get favorites:', err);
    return [];
  }
}

// Add exercise ID to favorites
export function addFavorite(exerciseId) {
  try {
    const favorites = getFavoriteIds();

    if (favorites.includes(exerciseId)) {
      return false;
    }

    favorites.push(exerciseId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  } catch (err) {
    console.error('Failed to add favorite:', err);
    return false;
  }
}

// Remove exercise ID from favorites
export function removeFavorite(exerciseId) {
  try {
    const favorites = getFavoriteIds();
    const filtered = favorites.filter(id => id !== exerciseId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to remove favorite:', err);
    return false;
  }
}

// Check if exercise is in favorites
export function isFavorite(exerciseId) {
  const favorites = getFavoriteIds();
  return favorites.includes(exerciseId);
}

// Toggle favorite status
export function toggleFavorite(exerciseId) {
  if (isFavorite(exerciseId)) {
    return removeFavorite(exerciseId);
  } else {
    return addFavorite(exerciseId);
  }
}