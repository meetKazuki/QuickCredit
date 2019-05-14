import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import app from '../src/app';

import User from '../src/models/User';
import Loan from '../src/models/Loan';
import Repayment from '../src/models/Repayment';
import { userDB, loanDB, repaymentDB } from './mock-data';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const Debug = debug('test_ENV');

let adminToken;
let userToken;

describe('routes: repayment', () => {
  context('POST /loans/:<loan-id>/repayments', () => {
    beforeEach((done) => {
      Loan.resetTable();
      Repayment.resetTable();
      loanDB.forEach(data => Loan.create(data));
      repaymentDB.forEach(data => Repayment.create(data));

      chai
        .request(app)
        .post('/auth/signin')
        .send({ email: 'meetdesmond.edem@gmail.com', password: 'secret' })
        .end((err, res) => {
          adminToken = res.body.data.token;
          done(err);
        });
    });

    it('should post a loan repayment successfully', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/loans/1/repayment`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ loanID: 1, paidAmount: 7000 })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(201);
          expect(res.body).to.have.property('data');
          done(err);
        });
    });

    specify('error if token is not supplied', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/loans/1/repayment`)
        .set('authoriztion', '')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if an invalid token supplied', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/loans/1/repayment`)
        .set('authoriztion', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if id parameter for loan does not exist', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/loans/19/repayment`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify.skip('error if loanID is not specified', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/1/repayment`)
        .set('authoriztion', `Bearer ${adminToken}`)
        .send({ loanID: '', paidAmount: 7000 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify.skip('error if paidAmount is not specified', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/1/repayment`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ loanID: 1, paidAmount: 7000 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context('GET /loans/:<loan-id>/repayments', () => {
    before((done) => {
      Loan.resetTable();
      loanDB.forEach(record => Loan.create(record));

      chai
        .request(app)
        .post('/auth/signin')
        .send({ email: 'etasseler0@is.gd', password: 'secret' })
        .end((err, res) => {
          userToken = res.body.data.token;
          done(err);
        });
    });

    it('should fetch a list of all repayment history for a loan ID', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/loans/1/repayments`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data).to.be.an('object');
          done(err);
        });
    });

    specify('error if token was not provided', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/loans/900/repayments`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify.skip('error if loanID is not found', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/loans/9/repayments`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if loanID is invalid', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/loans/ao/repayments`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
