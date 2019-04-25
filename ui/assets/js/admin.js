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

/* function toggleLoanModal(event) {
  event.preventDefault();
  const modalToggle = document.querySelector('modal-overlay');
  const modal = document.querySelector('.loan-modal');
  document.body.classList.toggle('modal-open');
  modalToggle.classList.toggle('modal-open');
  modal.classList.toggle('modal-open');
}

document.querySelector('.loan-modal .modal-close')
  .addEventListener('click', (event) => {
    toggleLoanModal(event);
  }); */
