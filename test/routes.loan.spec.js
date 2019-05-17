import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

import User from '../src/models/User';
import Loan from '../src/models/Loan';
import { userDB, loanDB } from './mock-data';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const authURI = '/api/v1/auth';

const userToken1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiT2JpdG8iLCJsYXN0TmFtZSI6IlVjaGloYSIsImFkZHJlc3MiOiJBa2F0c3VraSBIUSwgTGFuZCBvZiBXYXRlciIsImVtYWlsIjoidWNoaWhhLm9iaXRvQGFrYXRzdWtpLm9yZyIsInBhc3N3b3JkIjoiJDJhJDA4JHVpQ25vajdwL0tEbFR3VHg0NU1Hdi4zTzM4Qy4yUjUwWUtBQlpLTE0yZHpoL2h6WE95bUNPIiwic3RhdHVzIjoidW52ZXJpZmllZCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE1NTgwMjYyMzUsImV4cCI6MTU1ODExMjYzNX0.lClBIG6-l_NMD0pKzA0K5wIYr1W-ErA9Ys3RXB2lrfw';
const userToken1a = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdVc2VyIjp7ImlkIjoyLCJmaXJzdE5hbWUiOiJPYml0byIsImxhc3ROYW1lIjoiVWNoaWhhIiwiYWRkcmVzcyI6IkFrYXRzdWtpIEhRLCBMYW5kIG9mIFdhdGVyIiwiZW1haWwiOiJ1Y2hpaGEub2JpdG9AYWthdHN1a2kub3JnIiwicGFzc3dvcmQiOiIkMmEkMDgkV1dhN2xTa3NFWnVRTUpFMVZSMThOZXhELlpaeUFEVDRlWFdPL3N0OGlhUWg5VTliczNESnkiLCJzdGF0dXMiOiJ1bnZlcmlmaWVkIiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE1NTgwOTYwNTcsImV4cCI6MTU1ODE4MjQ1N30.589gzBgigeIuK_Ug5P7BAVwDLwBN6Z42M0sp9EQXAr0';
let userToken;
let adminToken;

describe('routes: loan', () => {
  describe('routes: Admin /loans', () => {
    context('GET /loans', () => {
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

      it('should fetch all loan applications', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            done(err);
          });
      });

      specify('error if token is not provided', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/users`)
          .set('authorization', '')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if an unauthorized request is made', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/users`)
          .set('authorization', `Bearer ${userToken1a}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.status(403);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });

    context('GET /loans/?status&repaid', () => {
      it('should return all loans that are approved and fully repaid', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=approved&repaid=true`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.eql(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            done(err);
          });
      });

      it('should return all loans that are approved and not fully repaid', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=approved&repaid=false`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.eql(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            done(err);
          });
      });

      specify('error for invalid status value entered', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=rejected&repaid=true`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.eql(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error for invalid repaid value entered', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=rejected&repaid=anytime`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.eql(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token is not provided', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/users`)
          .set('authorization', '')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if an unauthorized request is made', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/users`)
          .set('authorization', `Bearer ${userToken1a}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.status(403);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });

    context('GET /loans/:<loan-id>', () => {
      beforeEach((done) => {
        Loan.resetTable();
        loanDB.forEach(data => Loan.create(data));
        done();
      });

      it('should fetch a specific loan application', (done) => {
        const loan = Loan.table[1];
        const { id } = loan;

        chai
          .request(app)
          .get(`${baseURI}/loans/${id}`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('id');
            done(err);
          });
      });

      specify('error for non-existing loan record', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/9`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error for invalid loan ID supplied', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/axse`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token is not supplied', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/axse`)
          .set('authorization', '')
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token provided is invalid', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/axse`)
          .set('authorization', `${userToken1}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });

    context('PATCH /loans/<:loan-id>', () => {
      beforeEach((done) => {
        Loan.resetTable();
        loanDB.forEach(data => Loan.create(data));
        done();
      });
      const data = { status: 'approved' };

      it('should update loan status successfully', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/2`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('status');
            expect(res.body.data.status).to.equal('approved');
            done(err);
          });
      });

      specify('error if loan record is not found', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/9`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.equal(404);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if loan record ID specified is invalid', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/a9a`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(data)
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

  describe('routes: User /loans', () => {
    context('POST /loans', () => {
      before((done) => {
        Loan.resetTable();
        userDB.forEach(user => User.create(user));
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

      const loanData = {
        amount: 20000,
        tenor: 3,
      };

      it('should create a new loan record', (done) => {
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body.status).to.equal(201);
            done(err);
          });
      });

      it('specify error if token is not provided', (done) => {
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', '')
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.status).to.equal(401);
            done(err);
          });
      });

      specify('error if user does not supply loan amount', (done) => {
        loanData.amount = 0;

        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if user supplies an invalid loan amount', (done) => {
        loanData.amount = '0ss';
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if user does not provide loan tenor', (done) => {
        loanData.tenor = 0;
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if user supplies an invalid tenor', (done) => {
        loanData.tenor = 13;
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });
  });

  describe('routes: /User /Loans', () => {
    before((done) => {
      Loan.resetTable();
      loanDB.forEach(data => Loan.create(data));

      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'meetdesmond.edem@gmail.com', password: 'secret' })
        .end((err, res) => {
          adminToken = res.body.data.token;
          done(err);
        });
    });

    it('should return all loan requests made by a user', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/user/loans`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });

    specify('error if token is not provided', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/user/loans`)
        .set('authorization', '')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done(err);
        });
    });
  });
});
