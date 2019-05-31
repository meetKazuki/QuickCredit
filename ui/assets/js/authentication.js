function authenticateUser(userObj, method) {
  const url = 'https://localhost:4500/api/v1/auth/signup';

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userObj),
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      alert(error);
    });
}

document.querySelector('.form-container').addEventListener('submit', (evt) => {
  evt.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userDetails = {
    email, password,
  };

  if (window.location.href.includes('signup')) {
    const firstname = document.getElementById('firstName').value;
    const lastname = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;

    Object.assign(userDetails, {
      firstname, lastname, address,
    });
  }

  authenticateUser(userDetails, 'POST');
});
