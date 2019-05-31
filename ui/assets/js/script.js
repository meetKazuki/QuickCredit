/**
 * Handles toggle menu for mobile devices on the index page
 */
const hamburgerBtn = document.querySelector('.hamburger-menu');
hamburgerBtn.addEventListener('click', function toggleMenu() {
  const menu = document.querySelector('.navbar-menu');
  this.classList.toggle('menu-open');
  menu.classList.toggle('menu-open');
});

/**
 * Handle tab switch for loan records display
 */
const toggleTab = (tabName, getBtn) => {
  document.querySelectorAll('.responsive-table').forEach((element) => {
    // eslint-disable-next-line no-param-reassign
    element.style.display = 'none';
  });

  document.querySelector('.btn-toggled').classList.remove('btn-toggled');
  getBtn.classList.add('btn-toggled');
  document.querySelector(`#${tabName}`).style.display = 'block';
};

/**
  * Handle modals
 */
const modal = document.querySelector('#modal');
const modalToggle = document.querySelector('#modal-toggle');
const closeBtn = document.querySelector('#modal-close');
const openBtn = document.querySelector('.open-btn');

closeBtn.addEventListener('click', () => {
  modal.classList.toggle('closed');
  modalToggle.classList.toggle('closed');
});

openBtn.addEventListener('click', () => {
  modal.classList.toggle('closed');
  modalToggle.classList.toggle('closed');
});
