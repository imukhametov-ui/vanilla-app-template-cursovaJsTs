import { initHomePage } from './js/home.js';
import { initFavoritesPage } from './js/favorites.js';
import { subscribe } from './js/api.js';
import { notify } from './js/notify.js';
import './js/nav.js';

function setActiveNav() {
  const path = window.location.pathname;
  const navHome = document.getElementById('nav-home');
  const navFavorites = document.getElementById('nav-favorites');

  if (path.includes('favorites')) {
    navFavorites?.classList.add('active');
  } else {
    navHome?.classList.add('active');
  }
}

function setupHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const isMobile = () => window.innerWidth < 768;

  const handleScroll = () => {
    if (isMobile() && window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();
}

function setupSubscription() {
  const subForm = document.getElementById('subscription-form');
  if (subForm) {
    subForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = subForm.email.value;
      try {
        await subscribe(email);
        notify.success('Successfully subscribed!');
        subForm.reset();
      } catch (err) {
        // Error toast is shown by API interceptor
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  setupSubscription();
  setupHeaderScroll();

  // Initialize page-specific functionality based on elements present
  if (document.getElementById('exercises-container')) {
    initHomePage();
  }

  if (document.getElementById('favorites-container')) {
    initFavoritesPage();
  }
});