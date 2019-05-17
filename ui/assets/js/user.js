/**
 * Handles toggle menu for mobile devices
 */
const hamburgerBtn = document.querySelector('.hamburger-menu');
hamburgerBtn.addEventListener('click', function toggleMenu() {
  const menu = document.querySelector('nav');
  this.classList.toggle('menu-open');
  menu.classList.toggle('menu-open');
});
