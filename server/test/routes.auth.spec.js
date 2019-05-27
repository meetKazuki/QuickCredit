import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

const { expect } = chai;
const authURI = '/api/v1/auth';

let userData;

describe('routes: /auth', () => {
  context('POST /auth/signup', () => {
    it('should create a new user', (done) => {
      userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@email.com',
        address: '12 Iyana Ipaja, CMS',
        password: 'secret',
      };

      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('firstname');
          expect(res.body.data).to.have.property('lastname');
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

    specify('error when user signs up with empty first name', (done) => {
      userData = {
        firstname: '',
        lastname: 'Doe',
        email: 'john.doe@email.com',
        address: '12 Iyana Ipaja, CMS',
        password: 'secret',
      };

      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty last name', (done) => {
      userData = {
        firstname: 'John',
        lastname: '',
        email: 'john.doe@email.com',
        address: '12 Iyana Ipaja, CMS',
        password: 'secret',
      };
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty address', (done) => {
      userData = {
        firstname: 'John',
        lastname: '',
        email: 'john.doe@email.com',
        address: '12 Iyana Ipaja, CMS',
        password: 'secret',
      };
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty email', (done) => {
      userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: '',
        address: '12 Iyana Ipaja, CMS',
        password: 'secret',
      };
      chai
        .request(app)
        .post(`${authURI}/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
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
        .send({ email: 'john.doe@email.com', password: 'secret' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.property('token');
          done(err);
        });
    });

    specify('error if password provided is incorrect', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'john.doe@email.com', password: 'secr' })
        .end((err, res) => {
          expect(res).to.have.status(401);
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
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if password is not provided', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'john.doe@email.com', password: '' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if user does not exist', (done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'randomuser200@email.com', password: '2232323' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
