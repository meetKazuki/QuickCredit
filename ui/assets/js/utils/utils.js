/**
 * Check if user credentials is in the system
 */
function isAuth() {
  return localStorage.getItem('token');
}

/**
 * Get user homepage
 */
const isHomePage = window.location.pathname === '/'
                || window.location.pathname === '/ui/'
                || window.location.href.includes('index');

/**
 * Change landing page for authenticated user
 */
if (localStorage.getItem('token') && isHomePage) {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signin').remove();
    document.getElementById('signup').textContent = 'Continue';

    if (localStorage.getItem('role') === 'admin') {
      document.getElementById('signup').href = './admin-users.html';
      document.getElementById('hero-text').remove();
    } else {
      document.getElementById('signup').href = './user-dashboard.html';
      document.getElementById('hero-text').remove();
    }
  });
}

/**
 * Handle logout event
 */
if (localStorage.getItem('token')) {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signout').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = './signin.html';
    });
  });
}
