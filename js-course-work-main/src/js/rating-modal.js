import { showGlobalNotification } from './global-notification.js';
import { validateEmail, showFieldError } from './form-validation.js';

let currentExerciseId = null;
let userRating = 0;

const onEscRatingPress = (e) => {
  if (e.key === 'Escape') {
    closeRatingModal();
  }
};

const onModalClick = (e) => {
  const isOverlay = e.target.classList.contains('rating-modal__overlay');
  const isCloseBtn = e.target.classList.contains('js-close-rating') || e.target.closest('.js-close-rating');

  if (isOverlay || isCloseBtn) {
    closeRatingModal();
  }
};

export function initRatingModal() {
  const form = document.getElementById('js-rating-modal-form');
  const stars = document.querySelectorAll('.rating-modal__star');

  if (!form) return;

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      userRating = index + 1;
      updateStarsUI(userRating);
      const ratingDisplay = document.getElementById('js-rating-modal-value');
      if (ratingDisplay) ratingDisplay.textContent = userRating.toFixed(1);

      const ratingInput = document.getElementById('js-rating-input');
      if (ratingInput) ratingInput.value = userRating;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('js-rating-modal-email');
    const commentInput = document.getElementById('js-rating-modal-comment');
    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
      showFieldError(emailInput, null, 'Invalid email');
      return;
    }

    const result = await submitRating(email, commentInput.value.trim());
    if (result.success) {
      showGlobalNotification('Rating submitted!', 'success');
      closeRatingModal(true);
    } else {
      showGlobalNotification(result.error, 'error');
    }
  });
}

export function openRatingModal(id) {
  currentExerciseId = id;
  const modal = document.getElementById('js-rating-modal');
  if (!modal) return;

  modal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';

  window.addEventListener('keydown', onEscRatingPress);
  modal.addEventListener('click', onModalClick);
}

export function closeRatingModal(shouldRestoreExercise = false) {
  const modal = document.getElementById('js-rating-modal');
  const exerciseModal = document.getElementById('js-exercise-modal');

  if (!modal) return;

  modal.classList.add('is-hidden');
  document.body.style.overflow = shouldRestoreExercise ? 'hidden' : '';

  window.removeEventListener('keydown', onEscRatingPress);
  modal.removeEventListener('click', onModalClick);

  if (shouldRestoreExercise && exerciseModal) {
    exerciseModal.classList.remove('is-hidden');
  }

  userRating = 0;
  updateStarsUI(0);
  document.getElementById('js-rating-modal-form')?.reset();
  document.getElementById('js-rating-modal-value').textContent = '0.0';
}

function updateStarsUI(rating) {
  const stars = document.querySelectorAll('.rating-modal__star svg path');
  stars.forEach((star, i) => {
    star.setAttribute('fill', i < rating ? '#EEA10C' : 'rgba(244, 244, 244, 0.2)');
    star.setAttribute('stroke', i < rating ? '#EEA10C' : 'rgba(244, 244, 244, 0.2)');
  });
}

async function submitRating(email, review) {
  try {
    const response = await fetch(`https://your-energy.b.goit.study/api/exercises/${currentExerciseId}/rating`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rate: userRating, email, review })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}