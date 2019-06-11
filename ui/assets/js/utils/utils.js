/**
 * Set environment configuration
 */
window.env = {
  APP_ENV: 'production',
  API_URI: '',
};

if (
  window.location.hostname === '127.0.0.1'
  || window.location.hostname === 'localhost'
  || window.location.protocol === 'file:'
) {
  window.env.APP_ENV = 'develop';
  window.env.API_URI = 'http://localhost:4500';
}

/**
 * Check if user credentials is in the system
 */
function isAuth() {
  return localStorage.getItem('token');
}

/**
 * Returns homepage
 */
function isHome() {
  const homePage = window.location.pathname === '/'
            || window.location.pathname === '/ui/'
            || window.location.href.includes('index');
  return homePage;
}

/**
 * Change landing page for authenticated user
 */
if (isAuth() && isHome()) {
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
if (isAuth()) {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signout').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = './signin.html';
    });
  });
}
