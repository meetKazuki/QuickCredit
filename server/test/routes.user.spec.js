import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const authURI = '/api/v1/auth';

let adminToken;
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2OWUyNzVmLWJmYWUtNDA0Yy05MzU5LTIwMjcyZjRmNmM1YSIsImVtYWlsIjoidWNoaWhhLm9iaXRvQGFrYXRzdWtpLm9yZyIsImlzYWRtaW4iOmZhbHNlLCJzdGF0dXMiOiJ1bnZlcmlmaWVkIiwiaWF0IjoxNTU5NzQ2OTMzfQ.ZMTQ5QGTg1_1xozyUHpEPsfo8LCJSbgqWxyGRHussjk';

describe('routes: /users', () => {
  context('GET /users', () => {
    before((done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'admin@admin.com', password: 'admin' })
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
        .set('authorization', 'Bearer hjfdnfdsai1')
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
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context('GET /users/:user-email', () => {
    it('should fetch a specific user', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users/uchiha.obito@akatsuki.org`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0]).to.have.property('firstname');
          expect(res.body.data[0]).to.have.property('lastname');
          expect(res.body.data[0]).to.have.property('address');
          expect(res.body.data[0]).to.have.property('email');
          expect(res.body.data[0]).to.have.property('status');
          expect(res.body.data[0]).to.have.property('isadmin');
          done(err);
        });
    });

    specify('error if token is not provided', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users/uchiha.obito@akatsuki.org`)
        .set('authorization', '')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if token is invalid', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users/uchiha.obito@akatsuki.org`)
        .set('authorization', `${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error for non-existing resource', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users/sarutobi@hokage.org`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error for invalid email', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users/sarutobi@hokage`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context('PATCH /users/:user-email', () => {
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

    specify('error if status option is not an accepted value', (done) => {
      const error = { status: 'verify' };
      chai
        .request(app)
        .patch(`${baseURI}/users/john.doe@email.com/verify`)
        .send(error)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error for verifying an already verified user', (done) => {
      chai
        .request(app)
        .patch(`${baseURI}/users/john.doe@email.com/verify`)
        .send(data)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
