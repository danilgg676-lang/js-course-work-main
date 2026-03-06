import { openExerciseModal } from './exercise-modal.js';
import { getFavorites } from './favorites.js';

import runnerIcon from '../images/svg/runner-icon-light.svg';
import arrowIcon from '../images/svg/arrow.svg'

let currentFilter = 'Muscles';
let currentCategory = null;
const cardsContainer = document.getElementById('js-exercises-container');
const paginationContainer = document.getElementById('js-exercises-pagination');
const searchForm = document.getElementById('js-exercises-search');

function toggleSearch(show) {
  if (searchForm) {
    searchForm.style.display = show ? 'flex' : 'none';
  }
}

function updateBreadcrumbs(category = null) {
  const breadcrumbCurrent = document.querySelector('.js-breadcrumb-current');
  const breadcrumbDivider = document.querySelector('.js-breadcrumb-divider');
  
  if (category) {
    breadcrumbCurrent.textContent = category;
    breadcrumbCurrent.style.display = 'inline';
    breadcrumbDivider.style.display = 'inline';
  } else {
    breadcrumbCurrent.style.display = 'none';
    breadcrumbDivider.style.display = 'none';
  }
}

export function initSearch() {
  const searchForm = document.getElementById('js-exercises-search');
  const searchInput = document.getElementById('js-exercises-search-input');
  if (!searchForm || !searchInput) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = searchInput.value.trim();
    if (currentCategory) {
      loadExercisesByCategory(currentCategory, 1, keyword);
    }
  });
}

export function initCardsEventListener() {
  if (!cardsContainer) return;

  cardsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('[data-category-name], [data-exercise-id]');
    if (!card) return;

    if (card.dataset.categoryName) {
      loadExercisesByCategory(card.dataset.categoryName);
    } else if (card.dataset.exerciseId) {
      openExerciseModal(card.dataset.exerciseId);
    }
  });
}

export async function loadExerciseCards(filter, page = 1,isPageChange = false) {
  currentFilter = filter;
  currentCategory = null;

  const limit = window.innerWidth < 768 ? 9 : 12;

  if (!isPageChange) {
    toggleSearch(false);
    updateBreadcrumbs(null);
    const searchInput = document.getElementById('js-exercises-search-input');
    if (searchInput) searchInput.value = '';
  }
  try {
    const response = await fetch(`https://your-energy.b.goit.study/api/filters?filter=${filter}&page=${page}&limit=${limit}`);
    const data = await response.json();
    
    renderCards(data.results, 'category');
    renderPagination(data.totalPages, page, filter, 'category');
  } catch (err) {
  }
}

export async function loadExercisesByCategory(category, page = 1, keyword = '') {
  currentCategory = category;
  toggleSearch(true);
  updateBreadcrumbs(category);
  
  const searchInput = document.getElementById('js-exercises-search-input');
  const currentKeyword = keyword || (searchInput ? searchInput.value.trim() : '');

  let queryParam = 'muscles';
  if (currentFilter === 'Body parts') queryParam = 'bodypart';
  if (currentFilter === 'Equipment') queryParam = 'equipment';

  let limit = window.innerWidth > 767 ? 10 : 8;

  try {
    let url = `https://your-energy.b.goit.study/api/exercises?${queryParam}=${category.toLowerCase()}&page=${page}&limit=${limit}`;
    if (currentKeyword) url += `&keyword=${encodeURIComponent(currentKeyword)}`;

    const response = await fetch(url);
    const data = await response.json();
    
    renderCards(data.results, 'exercise');
    renderPagination(data.totalPages, page, category, 'exercise');
  } catch (err) {
  }
}

export function renderPagination(totalPages, currentPage, filterOrCategory, type) {
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  currentPage = Number(currentPage);
  let buttons = '';
  
  const range = 1;
  let lastPushed = 0;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
      
      if (lastPushed && i - lastPushed > 1) {
        buttons += `<span class="pagination__dots">...</span>`;
      }
      
      buttons += `
        <button class="exercises__content__main__cards__pagination__btn ${i === currentPage ? 'is-active' : ''}" data-page="${i}">
          ${i}
        </button>`;
      
      lastPushed = i;
    }
  }

  paginationContainer.innerHTML = buttons;

  paginationContainer.onclick = (e) => {
    const btn = e.target.closest('.exercises__content__main__cards__pagination__btn');
    if (!btn) return;

    const page = btn.dataset.page;
    if (type === 'category') {
      loadExerciseCards(filterOrCategory, page,true);
    } else {
      loadExercisesByCategory(filterOrCategory, page);
    }
    
    const section = document.querySelector('.exercises');
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  };
}

function renderCards(data, type) {
  if (!cardsContainer) return;
  
  if (data.length === 0) {
    cardsContainer.innerHTML = '<p class="exercises__empty">No exercises found.</p>';
    return;
  }
  if (type === 'exercise') {
    cardsContainer.classList.add('is-exercise-view');
  } else {
    cardsContainer.classList.remove('is-exercise-view');
  }

  cardsContainer.innerHTML = data.map(item => 
    type === 'category' ? createCategoryCard(item) : createExerciseCard(item)
  ).join('');
}

function createCategoryCard({ name, filter, imgURL }) {
  return `
    <li class="exercises__content__main__cards__cards-item" data-category-name="${name}">
      <img src="${imgURL}" alt="${name}" loading="lazy">
      <div class="exercises__content__main__cards__cards-item-overlay">
        <h3>${name}</h3>
        <p>${filter}</p>
      </div>
    </li>`;
}

function createExerciseCard(exercise) {
  return `
    <li><div class="exercises__content__main__cards__cards-item-exercise" data-exercise-id="${exercise._id}">
      <div class="exercise-card-top">
        <div class="exercise-card-badge">WORKOUT</div>
        <div class="exercise-card-rating">
          <span>${exercise.rating.toFixed(1)}</span>
          <svg class="exercise-card-star-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <button class="exercise-card-start-btn" type="button">
          Start
          <img src="${arrowIcon}" width="10" height="10">
        </button>
      </div>

      <div class="exercise-card-title">
        <img src="${runnerIcon}" width='18' height='18' class="exercise-card-icon-container">
        <h3 class="exercise-card-name">${exercise.name}</h3>
      </div>

      <div class="exercise-card-info">
        <p><span>Burned calories:</span> ${exercise.burnedCalories} / ${exercise.time} min</p>
        <p><span>Body part:</span> ${exercise.bodyPart}</p>
        <p><span>Target:</span> ${exercise.target}</p>
      </div>
    </div></li>`;
}

export function switchToHome() {
  const exercisesSection = document.querySelector('.exercises');
  if (exercisesSection) exercisesSection.classList.remove('is-favorites-page');
  
  const filtersContainer = document.querySelector('.exercises__content__header-filters');
  if (filtersContainer) filtersContainer.style.display = 'flex';
  loadExerciseCards('Muscles', 1);
}

export function switchToFavorites() {
  const exercisesSection = document.querySelector('.exercises');
  if (exercisesSection) exercisesSection.classList.add('is-favorites-page');

  const cardsContainer = document.getElementById('js-exercises-container');
  const paginationContainer = document.getElementById('js-exercises-pagination');
  const filterGroup = document.querySelector('.exercises__content__header-filters');

  if (filterGroup) filterGroup.style.display = 'none';
  toggleSearch(false);
  updateBreadcrumbs(null);

  cardsContainer.innerHTML = '';

  const rawData = getFavorites();
  const favoriteData = rawData.filter(item => typeof item === 'object' && item !== null && item._id);
  if (favoriteData.length === 0) {
    cardsContainer.classList.remove('is-exercise-view');
    cardsContainer.innerHTML = `
      <li class="exercises__empty">
        <p>It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>
      </li>`;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  cardsContainer.classList.add('is-exercise-view');
  
  const validData = favoriteData.filter(item => typeof item === 'object' && item.rating !== undefined);
  
  cardsContainer.innerHTML = validData.map(item => createExerciseCard(item)).join('');
  
  if (paginationContainer) paginationContainer.innerHTML = '';
}

export function initFilters() {
  const filtersGroup = document.querySelector('.exercises__filters-group');
  if (!filtersGroup) return;

  filtersGroup.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('exercises__filters-group-item') && 
        !target.classList.contains('exercises__filters-group-item--active')) {
      
      const buttons = filtersGroup.querySelectorAll('.exercises__filters-group-item');
      buttons.forEach(btn => btn.classList.remove('exercises__filters-group-item--active'));

      target.classList.add('exercises__filters-group-item--active');

      const filter = target.dataset.filter;

      loadExerciseCards(filter, 1);
    }
  });
}