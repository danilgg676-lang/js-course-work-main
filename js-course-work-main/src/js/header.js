import { switchToFavorites, switchToHome } from './exercises.js';

export function initHeader() {
  const burgerBtn = document.querySelector('.header__burger');
  const closeMenuBtn = document.querySelector('.mobile-menu__close');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  const headerNav = document.querySelector('.header__nav');
  const mobileNav = document.querySelector('.mobile-menu__nav'); 

  const closeMenu = () => {
    mobileMenu?.style.setProperty('display', 'none');
    document.body.style.overflow = '';
  };

  burgerBtn?.addEventListener('click', () => {
    mobileMenu?.style.setProperty('display', 'block');
    document.body.style.overflow = 'hidden';
  });

  closeMenuBtn?.addEventListener('click', closeMenu);

  const handleNavigation = (e) => {
    const navBtn = e.target.closest('[data-page]');
    if (!navBtn) return;

    e.preventDefault();
    
    const page = navBtn.dataset.page;
    updateActiveNavLink(page);
    const homeSection = document.querySelector('.home__content');
    const footerSection = document.querySelector('.footer');
    const breadcrumbBase = document.querySelector('.js-breadcrumb-base');

    if (page === 'favorites') {
      if (homeSection) homeSection.style.display = 'none';
      if (footerSection) footerSection.style.display = 'none';
      if (breadcrumbBase) breadcrumbBase.textContent = 'Favorites';
      switchToFavorites();
    } else {
      if (homeSection) homeSection.style.display = 'block';
      if (footerSection) footerSection.style.display = 'block';

      if (breadcrumbBase) breadcrumbBase.textContent = 'Exercises';
      switchToHome();
    }
    
    closeMenu();
  };

  headerNav?.addEventListener('click', handleNavigation);
  mobileNav?.addEventListener('click', handleNavigation);
}

function updateActiveNavLink(page) {
  const navLinks = document.querySelectorAll('.header__nav-link, .mobile-menu__link');
  navLinks.forEach(btn => {
    btn.classList.toggle('header__nav-link--active', btn.dataset.page === page);
  });
}