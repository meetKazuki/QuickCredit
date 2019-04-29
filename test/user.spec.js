import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /, /404, /api/v1', () => {
  it('should render the index page', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should render the API page', (done) => {
    chai
      .request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should throw an error for any invalid route', (done) => {
    chai
      .request(app)
      .get('/404')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        done(err);
      });
  });
});

describe('routes: /auth', () => {
  context('POST /auth/signup', () => {
    const userData = {
      firstName: 'Sasuke',
      lastName: 'Uchiha',
      address: 'Hidden-Leaf Village, Konoha',
      email: 'uchihasasuke@anbu.com',
      password: 'secret',
    };

    it('should create a new user', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          // expect(res.body.data).to.have.property('token');
          done(err);
        });
    });

    // specify.skip('error for already existing user with email', (done) => {
    //   chai
    //     .request(app)
    //     .post('/api/v1/auth/signup')
    //     .send(userData)
    //     .end((err, res) => {
    //       expect(res).to.have.status(409);
    //       expect(res.body.status).to.be.equal(409);
    //       expect(res.body.data).to.have.property('error');
    //       done(err);
    //     });
    // });

    specify('error when user signs up with empty last name', (done) => {
      userData.lastName = '';
      chai
        .request(app)
        .post('/api/v1/auth/signup')
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
        .post('/api/v1/auth/signup')
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
        .post('/api/v1/auth/signup')
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
        .post('/api/v1/auth/signup')
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
