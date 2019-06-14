function createRepayment(id, body) {
  const token = window.localStorage.getItem('token');
  const url = `http://localhost:4500/api/v1/loans/${id}/repayment`;

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
        console.log('request success -> ', responseObj);
      } else {
        console.log('request failed...', responseObj);
      }
    })
    .catch((error) => {
      alert(error);
    });
}

document.getElementById('form').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const loanId = document.getElementById('loanId').value.trim();
  const amount = document.getElementById('amount').value.trim();
  const recordObj = { loanId, paidAmount: +amount };

  createRepayment(loanId, recordObj);
});
