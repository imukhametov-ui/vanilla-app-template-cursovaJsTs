// src/js/api.js
// Сервіс для роботи з API Your Energy

const BASE_URL = 'https://your-energy.b.goit.study/api';

class YourEnergyAPI {
  // Отримання цитати дня
  async getQuote() {
    try {
      const response = await fetch(`${BASE_URL}/quote`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      return await response.json();
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw error;
    }
  }

  // Отримання фільтрів
  async getFilters(filterType, page = 1, limit = 12) {
    try {
      const response = await fetch(
        `${BASE_URL}/filters?filter=${filterType}&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch filters');
      return await response.json();
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }
  }

  // Отримання каталогу вправ
  async getExercises(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.bodypart) queryParams.append('bodypart', params.bodypart);
    if (params.muscles) queryParams.append('muscles', params.muscles);
    if (params.equipment) queryParams.append('equipment', params.equipment);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    try {
      const response = await fetch(`${BASE_URL}/exercises?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return await response.json();
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  // Отримання деталей вправи
  async getExerciseById(exerciseId) {
    try {
      const response = await fetch(`${BASE_URL}/exercises/${exerciseId}`);
      if (!response.ok) throw new Error('Failed to fetch exercise details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching exercise details:', error);
      throw error;
    }
  }

  // Оцінювання вправи
  async rateExercise(exerciseId, rating) {
    try {
      const response = await fetch(
        `${BASE_URL}/exercises/${exerciseId}/rating`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating }),
        }
      );
      if (!response.ok) throw new Error('Failed to rate exercise');
      return await response.json();
    } catch (error) {
      console.error('Error rating exercise:', error);
      throw error;
    }
  }

  // Підписка
  async subscribe(email) {
    try {
      const response = await fetch(`${BASE_URL}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Failed to subscribe');
      return await response.json();
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  }
}

export default new YourEnergyAPI();