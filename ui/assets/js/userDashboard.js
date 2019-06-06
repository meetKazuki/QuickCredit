/**
 * Render User Details
 */
const isUserDashboard = window.location.href.includes('user-dashboard') || false;
if (isUserDashboard) {
  const fullname = localStorage.getItem('fullname');
  const address = localStorage.getItem('address');
  const email = localStorage.getItem('email');

  document.getElementById('fullname').textContent = fullname;
  document.getElementById('address').textContent = address;
  document.getElementById('email').textContent = email;
}

/**
 * Return Local Date/Time
 */
function convertUTCToLocalTime(timeString) {
  const dateObj = new Date(timeString);
  const formatDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);

  return formatDate;
}

/**
 * Render User Loan Records
 */
function renderLoanRecords(recordObj) {
  const list = document.getElementById('record-list');
  const row = document.createElement('tr');
  const {
    createdon, amount, interest, tenor, paymentinstallment, balance, status, repaid,
  } = recordObj;

  row.innerHTML = `
    <td>${convertUTCToLocalTime(createdon)}</td>
    <td>${amount}</td>
    <td>${interest}</td>
    <td>${tenor}</td>
    <td>${paymentinstallment}</td>
    <td>${balance}</td>
    <td>${status}</td>
    <td>${repaid}</td>
  `;
  row.setAttribute('data-record', JSON.stringify(recordObj));
  return list.appendChild(row);
}

/**
 * GET /user/loans
 */
function getUserLoans() {
  const url = 'http://localhost:4500/api/v1/user/loans';
  const token = window.localStorage.getItem('token');

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((responseObj) => {
      const loanRecords = responseObj.data;
      return loanRecords.map(loanDetails => renderLoanRecords(loanDetails));
    })
    .catch(error => alert(error));
}

getUserLoans();
