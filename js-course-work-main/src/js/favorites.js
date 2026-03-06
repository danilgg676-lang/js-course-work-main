const STORAGE_KEY = 'favorites-exercises';

export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.some(exercise => exercise._id === id);
}

export function toggleFavorite(exercise) {
  let favorites = getFavorites();
  const index = favorites.findIndex(item => item._id === exercise._id);

  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(exercise);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return index === -1;
}