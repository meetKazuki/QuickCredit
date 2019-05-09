import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import app from '../src/app';

import User from '../src/models/User';
import Loan from '../src/models/Loan';
import { userDB, loanDB } from './mock-data';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const Debug = debug('test_ENV');

let adminToken;
let userToken;

describe('routes: loan', () => {
  describe('routes: Admin /loans', () => {
    context('GET /loans', () => {
      before((done) => {
        chai
          .request(app)
          .post(`${baseURI}/auth/signin`)
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

      /* specify('error if an unauthorized request is made', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/users`)
          .set('authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.status(403);
            expect(res.body).to.have.property('error');
            done(err);
          });
      }); */
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

      /* specify('error if an unauthorized request is made', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/users`)
          .set('authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.status(403);
            expect(res.body).to.have.property('error');
            done(err);
          });
      }); */
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
            expect(res.body.data).to.have.property('user');
            expect(res.body.data).to.have.property('createdOn');
            expect(res.body.data).to.have.property('status');
            expect(res.body.data).to.have.property('repaid');
            expect(res.body.data).to.have.property('tenor');
            expect(res.body.data).to.have.property('amount');
            expect(res.body.data).to.have.property('paymentInstallment');
            expect(res.body.data).to.have.property('balance');
            expect(res.body.data).to.have.property('interest');
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
          .post(`${baseURI}/auth/signin`)
          .send({ email: 'etasseler0@is.gd', password: 'secret' })
          .end((err, res) => {
            userToken = res.body.data.token;
            done(err);
          });
      });

      const loanData = {
        firstName: 'Esteban',
        lastName: 'Tasseler',
        user: 'etasseler0@is.gd',
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
            expect(res.body.data).to.deep.equal({
              message: "Loan request received. We'll get back to you shortly.",
              firstName: res.body.data.firstName,
              lastName: res.body.data.lastName,
              email: res.body.data.email,
              amount: res.body.data.amount,
              tenor: res.body.data.tenor,
            });
            done(err);
          });
      });

      specify('error if user does not supply a firstname', (done) => {
        loanData.firstName = '';
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

      specify('error if user supplies an invalid firstname', (done) => {
        loanData.firstName = '@@$-';
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

      specify('error if user does not supply a lastname', (done) => {
        loanData.lastName = '';
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

      specify('error if user does not supply an email', (done) => {
        loanData.user = '';
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

      specify('error if user does not supply an invalid email', (done) => {
        loanData.user = 'eer.com';

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
});
