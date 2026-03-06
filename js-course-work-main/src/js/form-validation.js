export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function showFieldError(input, errorElement, message) {
  if (input) input.classList.add('error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

export function hideFieldError(input, errorElement) {
  if (input) input.classList.remove('error');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}