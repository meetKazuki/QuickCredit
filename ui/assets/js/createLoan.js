function displayProgress(selector, text) {
  // eslint-disable-next-line no-param-reassign
  selector.innerHTML = text;
}

function createLoan(body) {
  const url = 'http://localhost:4500/api/v1/loans';
  const token = window.localStorage.getItem('token');
  const element = document.querySelector('button[type=submit]');
  const defaultText = element.textContent;

  displayProgress(element, 'Processing request...');

  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then((responseObj) => {
      if (responseObj.status === 201) {
        console.log('responseObj Successful ->', responseObj);
        displayProgress(element, 'Request Successful');
      } else {
        console.log(responseObj);
        displayProgress(element, 'Request failed...');
      }
    })
    .catch((error) => {
      alert(error);
    });
}

document.getElementById('form').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const amount = JSON.parse(document.getElementById('amount').value);
  const tenor = JSON.parse(document.getElementById('tenor').value);
  const loanObj = { amount, tenor };

  createLoan(loanObj);
});
