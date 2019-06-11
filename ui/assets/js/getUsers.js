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
 * Render User List
 */
function renderUserRecords(recordObj) {
  const list = document.getElementById('user-list');
  const row = document.createElement('tr');
  const {
    firstname, lastname, address, status,
  } = recordObj;

  row.innerHTML = `
    <td>${firstname}</td>
    <td>${lastname}</td>
    <td>${address}</td>
    <td>${status}</td>
    <td>
      <div class="wrapper">
        <button class="btn-action btn-info"><i class="fas fa-eye"></i></button>
        <button class="btn-action btn-verified">
          <i class="fas fa-user-check"></i> <span>verified</span>
        </button>
      </div>
    </td>
  `;
  row.setAttribute('user-record', JSON.stringify(recordObj));
  return list.appendChild(row);
}

/**
 * GET /users
 */
function getUsers() {
  const url = 'http://localhost:4500/api/v1/users';
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
      const userRecords = responseObj.data;
      return userRecords.map(user => renderUserRecords(user));
    })
    .catch(error => alert(error));
}
getUsers();
