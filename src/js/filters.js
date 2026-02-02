// src/js/filters.js
// Компонент для фільтрів (Muscles, Body parts, Equipment)

import api from './api.js';

class Filters {
  constructor(tabsSelector, contentSelector) {
    this.tabsContainer = document.querySelector(tabsSelector);
    this.contentContainer = document.querySelector(contentSelector);
    this.activeFilter = 'Muscles';
    this.currentPage = 1;
    this.limit = 12;
  }

  createTabs() {
    if (!this.tabsContainer) return;

    const filters = ['Muscles', 'Body parts', 'Equipment'];
    
    this.tabsContainer.innerHTML = filters
      .map(
        filter => `
        <button 
          class="filter-tab ${filter === this.activeFilter ? 'active' : ''}" 
          data-filter="${filter}">
          ${filter}
        </button>
      `
      )
      .join('');

    this.tabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', e => this.handleTabClick(e));
    });
  }

  handleTabClick(e) {
    const filter = e.target.dataset.filter;
    if (filter === this.activeFilter) return;

    this.activeFilter = filter;
    this.currentPage = 1;
    
    this.tabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === filter);
    });

    this.loadFilterData();
  }

  async loadFilterData() {
    if (!this.contentContainer) return;

    try {
      this.contentContainer.innerHTML = '<div class="loader">Loading...</div>';

      const data = await api.getFilters(
        this.activeFilter,
        this.currentPage,
        this.limit
      );

      this.renderFilterItems(data.results);
    } catch (error) {
      console.error('Failed to load filter data:', error);
      this.contentContainer.innerHTML = `
        <div class="error-message">
          <p>Failed to load data. Please try again.</p>
        </div>
      `;
    }
  }

  renderFilterItems(items) {
    if (!items || items.length === 0) {
      this.contentContainer.innerHTML = '<p>No items found</p>';
      return;
    }

    this.contentContainer.innerHTML = items
      .map(
        item => `
        <div class="filter-item" data-filter="${item.filter}" data-name="${item.name}">
          <div class="filter-item-image">
            ${item.imgURL ? `<img src="${item.imgURL}" alt="${item.name}" />` : ''}
          </div>
          <div class="filter-item-info">
            <h3>${item.name}</h3>
            <p>${item.filter}</p>
          </div>
        </div>
      `
      )
      .join('');

    this.contentContainer.querySelectorAll('.filter-item').forEach(item => {
      item.addEventListener('click', e => this.handleFilterItemClick(e));
    });
  }

  handleFilterItemClick(e) {
    const item = e.currentTarget;
    const filterType = item.dataset.filter;
    const filterName = item.dataset.name;

    this.onFilterSelect({ type: filterType, name: filterName });
  }

  onFilterSelect(filter) {
    console.log('Filter selected:', filter);
  }

  init() {
    this.createTabs();
    this.loadFilterData();
  }
}

export default Filters;
