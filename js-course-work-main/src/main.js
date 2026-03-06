import { loadExerciseCards, initSearch, initCardsEventListener, initFilters } from './js/exercises.js';
import { initExerciseModal, closeExerciseModal } from './js/exercise-modal.js';
import { initRatingModal, closeRatingModal } from './js/rating-modal.js';
import { initGlobalNotification, showGlobalNotification } from './js/global-notification.js';
import { showFieldError, hideFieldError, validateEmail } from './js/form-validation.js';
import { initHeader } from './js/header.js';
import { displayQuote } from './js/quote.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  displayQuote();
  initGlobalNotification();
  initExerciseModal();
  initRatingModal();
  initSearch();
  initCardsEventListener();
  initFilters();
  loadExerciseCards('Muscles', 1);
  const subscribeForm = document.getElementById('js-subscribe-form');
  const subscribeInput = document.getElementById('subscribeEmail');
  const subscribeError = document.getElementById('js-subscribe-error');

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = subscribeInput.value.trim();

      if (!validateEmail(email)) {
        showFieldError(subscribeInput, subscribeError, 'Please enter a valid email address');
        return;
      }

      const result = await subscribeToNewsletter(email);
      if (result.success) {
        showGlobalNotification('Thank you for subscribing!', 'success');
        subscribeForm.reset();
      } else {
        showGlobalNotification(result.error, 'error');
      }
    });
  }
});

async function subscribeToNewsletter(email) {
  try {
    const response = await fetch('https://your-energy.b.goit.study/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Subscription failed');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}