import axios from 'axios';
import { notify } from './notify.js';
import { API_BASE_URL, LIMITS } from './constants.js';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Error messages mapping
const errorMessages = {
  400: 'Bad request. Please check your input.',
  401: 'Unauthorized. Please log in.',
  404: 'Resource not found.',
  409: 'This email has already been used.',
  500: 'Server error. Please try again later.',
  default: 'Something went wrong. Please try again.',
};

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle network errors (no internet, server unreachable)
    if (!error.response) {
      const isOffline = !navigator.onLine;
      const message = isOffline
        ? 'No internet connection. Please check your network.'
        : 'Unable to connect to server. Please try again later.';
      notify.error(message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Skip notification for 409 - handled specifically in controllers
    if (status === 409) {
      return Promise.reject(error);
    }

    const serverMessage = error.response.data?.message;
    const message = serverMessage || errorMessages[status] || errorMessages.default;

    notify.error(message);

    return Promise.reject(error);
  }
);

export const getQuote = async () => {
  const { data } = await api.get('/quote');
  return data;
};

export const getFilters = async ({ filter, page = 1, limit = LIMITS.DEFAULT }) => {
  const { data } = await api.get('/filters', {
    params: { filter, page, limit },
  });
  return data;
};

export const getExercises = async ({
  bodypart,
  muscles,
  equipment,
  keyword,
  page = 1,
  limit = LIMITS.EXERCISES_TABLET,
}) => {
  const params = { page, limit };
  if (bodypart) params.bodypart = bodypart;
  if (muscles) params.muscles = muscles;
  if (equipment) params.equipment = equipment;
  if (keyword) params.keyword = keyword;

  const { data } = await api.get('/exercises', { params });
  return data;
};

export const getExerciseById = async id => {
  const { data } = await api.get(`/exercises/${id}`);
  return data;
};

export const updateRating = async (id, rating, email, review = '') => {
  const body = { rate: rating, email };
  if (review) {
    body.review = review;
  }
  const { data } = await api.patch(`/exercises/${id}/rating`, body);
  return data;
};

export const subscribe = async email => {
  const { data } = await api.post('/subscription', { email });
  return data;
};