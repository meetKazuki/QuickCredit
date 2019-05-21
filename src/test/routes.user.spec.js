import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import User from '../src/models/User';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const authURI = '/api/v1/auth';

const userToken1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiT2JpdG8iLCJsYXN0TmFtZSI6IlVjaGloYSIsImFkZHJlc3MiOiJBa2F0c3VraSBIUSwgTGFuZCBvZiBXYXRlciIsImVtYWlsIjoidWNoaWhhLm9iaXRvQGFrYXRzdWtpLm9yZyIsInBhc3N3b3JkIjoiJDJhJDA4JHdqVUVoOEtCQ1hXRTQ1MW0wU0xmNk9Sa3RFMU51YzBVanBaYS5VWUFRYmZpdnREekxzb0t1Iiwic3RhdHVzIjoidW52ZXJpZmllZCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE1NTgwNDkzODIsImV4cCI6MTU1ODEzNTc4Mn0.kIoRMlVGzw9Qfh27qjjbfuZr-4KjWFv06wXizLjsCEs';
const userToken1a = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdVc2VyIjp7ImlkIjoyLCJmaXJzdE5hbWUiOiJPYml0byIsImxhc3ROYW1lIjoiVWNoaWhhIiwiYWRkcmVzcyI6IkFrYXRzdWtpIEhRLCBMYW5kIG9mIFdhdGVyIiwiZW1haWwiOiJ1Y2hpaGEub2JpdG9AYWthdHN1a2kub3JnIiwicGFzc3dvcmQiOiIkMmEkMDgkV1dhN2xTa3NFWnVRTUpFMVZSMThOZXhELlpaeUFEVDRlWFdPL3N0OGlhUWg5VTliczNESnkiLCJzdGF0dXMiOiJ1bnZlcmlmaWVkIiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE1NTgwOTYwNTcsImV4cCI6MTU1ODE4MjQ1N30.589gzBgigeIuK_Ug5P7BAVwDLwBN6Z42M0sp9EQXAr0';
let adminToken;

describe('routes: /auth', () => {
  context('POST /auth/signup', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      address: '12 Iyana Ipaja, CMS',
      password: 'secret',
    };

    it('should create a new user', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('firstName');
          expect(res.body.data).to.have.property('lastName');
          expect(res.body.data).to.have.property('email');
          done(err);
        });
    });

    specify('error if email provided already exists', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(409);
          done(err);
        });
    });

    specify('error when user signs up with empty last name', (done) => {
      userData.lastName = '';
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty first name', (done) => {
      userData.firstName = '';
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty address', (done) => {
      userData.address = '';
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty email', (done) => {
      userData.email = '';
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty password', (done) => {
      userData.password = '';
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context('POST /auth/signin', () => {
    it('should login user if details are valid', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({
          email: 'john.doe@email.com',
          password: 'secret',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data).to.have.property('token');
          done(err);
        });
    });

    specify('error if email is not provided', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: '', password: '1234345' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if invalid email type is provided', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'sffet', password: '1234345' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if password is not provided', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'meetdesmond.edem@gmail.com', password: '' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if password provided is incorrect', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'meetdesmond.edem@gmail.com', password: 'secr' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done(err);
        });
    });

    specify('error if user does not exist', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'randomuser200@email.com', password: '2232323' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});

describe('routes: /users', () => {
  context('GET /users', () => {
    before((done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'meetdesmond.edem@gmail.com', password: 'secret' })
        .end((err, res) => {
          adminToken = res.body.data.token;
          done(err);
        });
    });

    it('should fetch a list of all users', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          done(err);
        });
    });

    specify('error if token is not provided', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if token provided is invalid', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users`)
        .set('authorization', `Bearer ${userToken1}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when unauthorized user tries to access endpoint', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users`)
        .set('authorization', `Bearer ${userToken1a}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context('GET /users/:user-email', () => {
    it('should fetch a specific user', (done) => {
      const user = User.table[1];
      const { email } = user;

      chai
        .request(app)
        .get(`${baseURI}/users/${email}`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('firstName');
          expect(res.body.data).to.have.property('lastName');
          expect(res.body.data).to.have.property('address');
          expect(res.body.data).to.have.property('email');
          expect(res.body.data).to.have.property('status');
          expect(res.body.data).to.have.property('isAdmin');
          done(err);
        });
    });

    specify('error if token is not provided', (done) => {
      const email = 'sarutobi@hokage.org';
      chai
        .request(app)
        .get(`${baseURI}/users/${email}`)
        .set('authorization', '')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if token is invalid', (done) => {
      const email = 'sarutobi@hokage.org';
      chai
        .request(app)
        .get(`${baseURI}/users/${email}`)
        .set('authorization', `${userToken1a}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error for non-existing resource', (done) => {
      const email = 'sarutobi@hokage.org';
      chai
        .request(app)
        .get(`${baseURI}/users/${email}`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error for invalid email', (done) => {
      const email = 'sarutobi@hokage';
      chai
        .request(app)
        .get(`${baseURI}/users/${email}`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context('PATCH /users/:user-email', () => {
    before((done) => {
      chai
        .request(app)
        .post('/auth/signup')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          address: '12 Iyana Ipaja, CMS',
          password: 'secret',
        })
        .end((err, res) => {
          done(err);
        });
    });

    const data = { status: 'verified' };

    it('should edit the status of a user (mark user as verified)', (done) => {
      chai
        .request(app)
        .patch(`${baseURI}/users/john.doe@email.com/verify`)
        .send(data)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('status');
          done(err);
        });
    });

    specify('error if user record does not exist', (done) => {
      chai
        .request(app)
        .patch(`${baseURI}/users/etasseler0@is.com/verify`)
        .send(data)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if record supplied is invalid', (done) => {
      chai
        .request(app)
        .patch(`${baseURI}/users/etasseler/verify`)
        .send(data)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
