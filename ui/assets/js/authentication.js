function authenticateUser(userObj, endpoint) {
  const url = `http://localhost:4500/api/v1/auth/${endpoint}`;
  let defaultRole = 'user';
  let defaultPage = './user-dashboard.html';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userObj),
  })
    .then(response => response.json())
    .then((responseObj) => {
      if (responseObj.status === 200 || responseObj.status === 201) {
        const { data } = responseObj;
        localStorage.setItem('token', data.token);
        localStorage.setItem('fullname', `${data.firstname} ${data.lastname}`);
        if (data.isadmin) {
          defaultRole = 'admin';
          defaultPage = './admin-users.html';
        }
        localStorage.setItem('role', defaultRole);
        window.location.href = defaultPage;
      }
    })
    .catch((error) => {
      alert(error);
    });
}

document.getElementById('form').addEventListener('submit', (evt) => {
  evt.preventDefault();

  let endpoint = 'signin';
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userDetails = {
    email, password,
  };

  if (window.location.href.includes('signup')) {
    endpoint = 'signup';

    const firstname = document.getElementById('firstName').value;
    const lastname = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;

    Object.assign(userDetails, {
      firstname, lastname, address,
    });
  }

  authenticateUser(userDetails, endpoint);
});
