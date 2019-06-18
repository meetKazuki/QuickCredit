/**
 * Handle tab switch for loan records display
 */
const toggleTab = (tabName, getBtn) => {
  document.querySelectorAll('.responsive-table').forEach((element) => {
    const target = element;
    target.style.display = 'none';
  });

  document.querySelector('.btn-toggled').classList.remove('btn-toggled');
  getBtn.classList.add('btn-toggled');
  document.querySelector(`#${tabName}`).style.display = 'block';
};

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
 * Render All Loan Records
 */
function renderRecords(selector, recordObj) {
  const list = document.getElementById(`${selector}`);
  const row = document.createElement('tr');
  const {
    id, email, createdon, amount, status, repaid,
  } = recordObj;

  row.innerHTML = `
    <tr>
      <td>${email}</td>
      <td>${convertUTCToLocalTime(createdon)}</td>
      <td>${amount}</td>
      <td>${status}</td>
      <td>${repaid}</td>
      <td></td>
    </tr>
  `;
  row.style.cursor = 'pointer';
  row.setAttribute('data-records', JSON.stringify(recordObj));
  row.setAttribute('onclick', `getOneRecord('${id}')`);

  return list.appendChild(row);
}

/**
 * Retrieve all loan records
 */
function getRecords() {
  const url = 'http://localhost:4500/api/v1/loans';
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
      const { data } = responseObj;
      const allLoans = data;
      const repaidLoans = data.filter(e => e.repaid === true);
      const unpaidLoans = data.filter(e => e.repaid === false);

      allLoans.map(record => renderRecords('records-all', record));
      unpaidLoans.map(record => renderRecords('records-unpaid', record));
      repaidLoans.map(record => renderRecords('records-repaid', record));
    })
    .catch(error => alert(error));
}
getRecords();

function getOneRecord(id) {
  const url = `http://localhost:4500/api/v1/loans/${id}`;
  const token = window.localStorage.getItem('token');

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(responseObj => console.log(responseObj))
    .catch(error => alert(error));
}
