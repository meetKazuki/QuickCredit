import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const authURI = '/api/v1/auth';

let adminToken;
let userToken;

describe('routes: repayment', () => {
  context('POST /loans/:<loan-id>/repayment', () => {
    beforeEach((done) => {
      Loan.resetTable();
      Repayment.resetTable();
      loanDB.forEach(data => Loan.create(data));
      repaymentDB.forEach(data => Repayment.create(data));

      chai
        .request(app)
        .post(`${authURI}/signin`)
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
        .post(`${baseURI}/loans/8/repayment`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ loanID: 8, paidAmount: 7000 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if paidAmount is not specified', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/loans/1/repayment`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ loanID: 1, paidAmount: '' })
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
        .post(`${authURI}/signin`)
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

    /* specify('error if loanID is not found', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/loans/9/repayments`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    }); */

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
