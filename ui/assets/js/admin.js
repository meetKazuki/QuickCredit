/**
 * Handle tab switch for loan records display
 */
const toggleTab = (tabName, getBtn) => {
  document.querySelectorAll('.responsive-table').forEach((element) => {
    element.style.display = 'none';
  });

  document.querySelector('.btn-toggled').classList.remove('btn-toggled');
  getBtn.classList.add('btn-toggled');
  document.querySelector(`#${tabName}`).style.display = 'block';
};

/**
 * Handle modals
 */
var modal = document.querySelector('#modal');
var modalToggle = document.querySelector('#modal-toggle');
var closeBtn = document.querySelector('#modal-close');
var openBtn = document.querySelector('#open-btn');

closeBtn.addEventListener('click', function() {
  modal.classList.toggle('closed');
  modalToggle.classList.toggle('closed');
});

openBtn.addEventListener('click', function() {
  modal.classList.toggle('closed');
  modalToggle.classList.toggle('closed');
});
