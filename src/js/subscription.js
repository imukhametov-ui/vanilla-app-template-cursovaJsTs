// src/js/subscription.js
// Компонент для підписки на розсилку

import api from './api.js';

class Subscription {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.emailInput = null;
    this.submitBtn = null;
  }

  setupForm() {
    if (!this.form) {
      console.error('Subscription form not found');
      return;
    }

    this.emailInput = this.form.querySelector('input[type="email"]');
    this.submitBtn = this.form.querySelector('button[type="submit"]');

    if (!this.emailInput || !this.submitBtn) {
      console.error('Email input or submit button not found');
      return;
    }

    this.form.addEventListener('submit', e => this.handleSubmit(e));
  }

  validateEmail(email) {
    const emailRegex = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const email = this.emailInput.value.trim();

    if (!email) {
      this.showMessage('Please enter your email', 'error');
      return;
    }

    if (!this.validateEmail(email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    try {
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Subscribing...';

      await api.subscribe(email);

      this.showMessage('Successfully subscribed!', 'success');
      this.emailInput.value = '';
    } catch (error) {
      console.error('Subscription failed:', error);
      this.showMessage('Failed to subscribe. Please try again.', 'error');
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Subscribe';
    }
  }

  showMessage(message, type) {
    const existingMessage = this.form.querySelector('.subscription-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `subscription-message ${type}`;
    messageEl.textContent = message;

    this.form.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }

  init() {
    this.setupForm();
  }
}

export default Subscription;