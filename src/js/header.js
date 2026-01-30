// src/js/header.js
// Логіка для Header (мобільне меню та навігація)

export function initHeader() {
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenuBtn = document.querySelector('.close-menu-btn');
  const menuLinks = document.querySelectorAll('.nav-link');

  if (!burgerBtn || !mobileMenu) {
    console.log('Header elements not found');
    return;
  }

  // Відкриття меню
  burgerBtn.addEventListener('click', () => {
    openMenu();
  });

  // Закриття меню
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      closeMenu();
    });
  }

  // Закриття при кліку на backdrop
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  // Закриття при кліку на посилання
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Закриття по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Функції
  function openMenu() {
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Підсвічування активної сторінки
  highlightActivePage();
}

function highlightActivePage() {
  const currentPage = window.location.pathname;
  const menuLinks = document.querySelectorAll('.nav-link');
  
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Перевіряємо чи поточна сторінка співпадає з посиланням
    if (currentPage.includes(href) || 
        (currentPage === '/' && href === 'index.html') ||
        (currentPage.includes('index') && href === 'index.html') ||
        (currentPage.includes('favorites') && href === 'favorites.html')) {
      link.classList.add('active');
    }
  });
}

// Налаштування соціальних посилань
export function setupSocialLinks() {
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

// Викликаємо автоматично
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSocialLinks);
} else {
  setupSocialLinks();
}