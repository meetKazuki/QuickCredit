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

/**
 * Handles which page to display to user
 */
const isHomePage = window.location.pathname === '/'
                || window.location.href.includes('index');
const noAuthPages = ['', 'index.html', 'signin.html', 'signup.html'];

// Check if page is served locally or from gh-pages
const baseUrlLength = window.location.pathname.includes('QuickCredit') ? 14 : 1;
const pageName = window.location.pathname.substr(baseUrlLength);

if (!localStorage.getItem('token') && !noAuthPages.includes(pageName)) {
  window.location.href = './login.html';
}

/**
 * Handle logout event
 */
if (localStorage.getItem('token')) {
  document.getElementById('').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = './';
  });
}
