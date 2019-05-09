# Quick Credit

[![Build Status](https://travis-ci.org/meetKazuki/QuickCredit.svg?branch=develop)](https://travis-ci.org/meetKazuki/QuickCredit)
[![Coverage Status](https://coveralls.io/repos/github/meetKazuki/QuickCredit/badge.svg?branch=develop)](https://coveralls.io/github/meetKazuki/QuickCredit?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/fc538b4791bc2acdedba/maintainability)](https://codeclimate.com/github/meetKazuki/QuickCredit/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/fc538b4791bc2acdedba/test_coverage)](https://codeclimate.com/github/meetKazuki/QuickCredit/test_coverage)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![GitHub issues](https://img.shields.io/github/issues/meetKazuki/QuickCredit.svg)


## Project Overview

Quick Credit is an online lending platform that provides short term soft loans to individuals. This
helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.


## Features
1. User (client) can sign up.
2. User (client) can login.
3. User (client) can request for only one loan at a time.
4. User (client) can view loan repayment history, to keep track of his/her liability or
responsibilities.
5. Admin can mark a client as verified, after confirming his/her home and work address.
6. Admin can view a specific loan application.
7. Admin can approve or reject a client’s loan application.
8. Admin can post loan repayment transaction in favour of a client.
9. Admin can view all loan applications.
10. Admin can view all current loans (not fully repaid).
11. Admin can view all repaid loans.

### Optional Features
1. User can reset password.
2. Integrate real time email notification upon approval or rejection of a loan request.


## Project Pipeline
- [Pivotal Tracker stories](https://www.pivotaltracker.com/n/projects/2326809)
- [UI Templates](https://meetkazuki.github.io/QuickCredit/ui)
- [Hosted API](https://quickcredit-staging.herokuapp.com/)


## Technologies Used
- [NodeJS](https://nodejs.org/en/download/)
- [ExpressJS](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/download/)


## Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
- [NodeJS](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installing/Run locally
- Make sure you have `nodejs`, `postgres` installed.
- Clone or fork repo :man_shrugging:

  ```bash
    - git clone https://github.com/meetKazuki/QuickCredit.git
    - cd QuickCredit
    - npm install
  ```
- Create/configure `.env` environment with your credentials
- Run `npm run dev-start` to start the server and watch for changes

### Testing
- To test or consume the API locally, you can make use of [*Postman*](https://www.getpostman.com) to simulate a front-end client.
- You can also test by running `npm test`.


## HTTP Requests
All API requests are made by sending a secure HTTPS request using one of the following methods, depending on the action being taken:

- `POST` Create a resource
- `PATCH` Update a resource
- `GET` Get a resource or list of resources
- `DELETE` Delete a resource

For `POST` and `PATCH` requests, the body of your request may include a JSON payload.

### HTTP Response Codes
Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `401` `Unauthorized` The supplied API credentials are invalid
- `403` `Forbidden` The credentials provided do not have permissions to access the requested resource
- `404` `Not Found` An attempt was made to access a resource that does not exist in the API
- `500` `Server Error` An error on the server occurred

## Inspiration/Resources
- [Design for Developers](https://frontendmasters.com/courses/design-for-developers/) by Sarah Drasner
- [Github Sign In/Sign Up page](https://github.com/login?return_to=%2Fjoin)
- [A quick guide to styling buttons using CSS](https://medium.freecodecamp.org/a-quick-guide-to-styling-buttons-using-css-f64d4f96337f) by Ashwini Sheshagiri
- [Button Hover Effects](https://twitter.com/Dave_Conner) by Dave Conner
- [CSS Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) by CSSTricks
- [w3Schools](https://www.w3schools.com/howto/howto_js_tabs.asp)
- [Building a Simple API with NodeJS & Express](https://www.codementor.io/olawalealadeusi896/building-simple-api-with-es6-krn8xx3k6) by Olawale Aladeusi:raised_hands:

## License
The QuickCredit API is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
