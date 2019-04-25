/**
 * Event handler for toggling menu on mobile devices
 */
// const hamburgerBtn = document.querySelector('.hamburger-menu');
// hamburgerBtn.addEventListener('click', function toggleMenu() {
//   const menu = document.querySelector('.navbar-menu');
//   this.classList.toggle('menu-open');
//   menu.classList.toggle('menu-open');
// });

/**
 * Handle tab switch for loans
 */
const openTab = (tabName, getBtn) => {
  document.querySelectorAll('.responsive-table').forEach((element) => {
    element.style.display = 'none';
  });

  document.querySelector('.btn-toggled').classList.remove('btn-toggled');
  getBtn.classList.add('btn-toggled');
  document.querySelector(`#${tabName}`).style.display = 'block';
};
