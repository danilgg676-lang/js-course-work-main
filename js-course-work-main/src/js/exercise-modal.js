import { isFavorite, toggleFavorite } from './favorites.js';
import { openRatingModal } from './rating-modal.js';
import { switchToFavorites } from './exercises.js';

let currentExercise = null;

export function initExerciseModal() {
  const modal = document.getElementById('js-exercise-modal');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-close-modal') || e.target.closest('#js-exercise-modal-close')) {
      closeExerciseModal();
    }
  });

  const favBtn = document.getElementById('js-exercise-modal-favorites');
  favBtn?.addEventListener('click', () => {
    if (!currentExercise) return;
    const wasAdded = toggleFavorite(currentExercise); 
    updateFavoriteButtonUI(wasAdded);

    const isFavoritesPage = document.querySelector('.js-breadcrumb-current')?.style.display === 'none' && 
                          document.querySelector('.exercises__content__header-filters')?.style.display === 'none';
    if (!wasAdded && isFavoritesPage) {
      switchToFavorites(); 
    }
  });

  const ratingBtn = document.getElementById('js-exercise-modal-rating-btn');
  ratingBtn?.addEventListener('click', () => {
    closeExerciseModal();
    openRatingModal(currentExercise._id);
  });
}
const onEscKeyPress = (e) => {
  if (e.key === 'Escape') {
    closeExerciseModal();
  }
};
export async function openExerciseModal(id) {
  const modal = document.getElementById('js-exercise-modal');
  
  try {
    const response = await fetch(`https://your-energy.b.goit.study/api/exercises/${id}`);
    currentExercise = await response.json(); 
    fillModalData(currentExercise);
    updateFavoriteButtonUI(isFavorite(id));
    
    modal.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onEscKeyPress);
  } catch (err) {
  }
}

function fillModalData(data) {
  document.getElementById('js-exercise-modal-image').src = data.gifUrl;
  document.getElementById('js-exercise-modal-title').textContent = data.name;
  document.getElementById('js-exercise-modal-description').textContent = data.description;
  document.getElementById('js-exercise-modal-rating-value').textContent = data.rating.toFixed(1);

  const mapping = {
    'target': data.target,
    'body-part': data.bodyPart,
    'equipment': data.equipment,
    'popular': data.popularity,
    'calories': `${data.burnedCalories} / ${data.time} min`
  };

  Object.entries(mapping).forEach(([id, value]) => {
    const el = document.getElementById(`js-exercise-modal-${id}`);
    if (el) el.textContent = value;
  });

  const starsContainer = document.getElementById('js-exercise-modal-stars');
  const stars = starsContainer.querySelectorAll('.exercise-modal__star-icon');
  const roundedRating = Math.round(data.rating);

  stars.forEach((star, index) => {
    star.classList.toggle('is-active', index < roundedRating);
  });
}

function updateFavoriteButtonUI(favorited) {
  const btn = document.getElementById('js-exercise-modal-favorites');
  const btnText = btn.querySelector('.js-favorites-text');
  
  if (favorited) {
    btnText.textContent = 'Remove from favorites';
    btn.classList.add('is-favorite');
  } else {
    btnText.textContent = 'Add to favorites';
    btn.classList.remove('is-favorite');
  }
}

export function closeExerciseModal() {
  const modal = document.getElementById('js-exercise-modal');
  if (modal) {
    modal.classList.add('is-hidden');
    document.body.style.overflow = '';

    window.removeEventListener('keydown', onEscKeyPress);
  }
}