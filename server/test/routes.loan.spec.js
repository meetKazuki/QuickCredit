import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import DB from '../src/database/dbconnection';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const authURI = '/api/v1/auth';

let userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2OWUyNzVmLWJmYWUtNDA0Yy05MzU5LTIwMjcyZjRmNmM1YSIsImVtYWlsIjoidWNoaWhhLm9iaXRvQGFrYXRzdWtpLm9yZyIsImlzYWRtaW4iOmZhbHNlLCJzdGF0dXMiOiJ1bnZlcmlmaWVkIiwiaWF0IjoxNTU5NzQ2OTMzfQ.ZMTQ5QGTg1_1xozyUHpEPsfo8LCJSbgqWxyGRHussjk';
let adminToken;

describe('routes: loan', () => {
  describe('routes: Admin /loans', () => {
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

    context('GET /loans', () => {
      it('should fetch all loan applications', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans`)
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
          .set('authorization', '')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if an unauthorized request is made', (done) => {
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

    context('GET /loans/?status', () => {
      it('should return records specified in the status query (approved)', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?status=approved`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0].status).to.equal('approved');
            done(err);
          });
      });

      it('should return records specified in the status query (rejected)', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?status=rejected`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0].status).to.equal('rejected');
            done(err);
          });
      });

      specify("error if status option provided is not 'approved'", (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?status=approve`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify("error if status option provided is not 'rejected'", (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?status=reject`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token is not provided', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?status=approved`)
          .set('authorization', '')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token provided is invalid', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?status=approved`)
          .set('authorization', 'Bearer ')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if an unauthorised request is made', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?status=approved`)
          .set('authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });

    context('GET /loans/?repaid', () => {
      it('should return records specified in the repaid (true) query', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?repaid=true`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0].repaid).to.equal(true);
            done(err);
          });
      });

      it('should return records specified in the repaid (false) query', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?repaid=false`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0].repaid).to.equal(false);
            done(err);
          });
      });

      specify("error if repaid option provided is not 'true'", (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?repaid=trua`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token is not provided', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?repaid=true`)
          .set('authorization', '')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token provided is invalid', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?repaid=true`)
          .set('authorization', 'Bearer ')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if an unauthorised request is made', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/?repaid=true`)
          .set('authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
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
            expect(res.body).to.have.property('data');
            expect(res.body.data[0].status).to.equal('approved');
            expect(res.body.data[0].repaid).to.equal(true);
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
            expect(res.body).to.have.property('data');
            expect(res.body.data[0].status).to.equal('approved');
            expect(res.body.data[0].repaid).to.equal(false);
            done(err);
          });
      });

      specify('error for invalid status option entered', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=approve&repaid=true`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.eql(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error for invalid repaid option entered', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=approve&repaid=anytime`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token is not provided', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=approved&repaid=false`)
          .set('authorization', '')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if an unauthorized request is made', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=approved&repaid=false`)
          .set('authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });

    context('GET /loans/:<loan-id>', () => {
      let loanId;
      before(async () => {
        const query = 'SELECT * FROM loans';
        const { rows } = await DB.query(query);
        loanId = rows[0].id;
      });

      it('should fetch a specific loan application', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/${loanId}`)
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
          .get(`${baseURI}/loans/50622358-a6d8-4659-9d90-706d7e074c09`)
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
          .set('authorization', `${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });

    context('PATCH /loans/<:loan-id>', () => {
      let loanId;
      const data = { status: 'approved' };
      before(async () => {
        const query = 'SELECT * FROM loans';
        const { rows } = await DB.query(query);
        loanId = rows[0].id;
      });

      it('should update loan status successfully', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/${loanId}`)
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

      specify('error if patch options are not the accepted value', (done) => {
        const error = { status: 'yes' };
        chai
          .request(app)
          .patch(`${baseURI}/loans/${loanId}`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(error)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if admin approves an already approved loan', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/${loanId}`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if loan record is not found', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/50622358-a6d8-4659-9d90-706d7e074c09`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(data)
          .end((err, res) => {
            expect(res).to.have.status(404);
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
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });
  });

  describe('routes: User POST/loans', () => {
    let loanData;

    context('POST /loans', () => {
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

      it('should create a new loan record', (done) => {
        loanData = { amount: 20000, tenor: 3 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.equal(201);
            expect(res.body.data).to.have.property('id');
            expect(res.body.data).to.have.property('email');
            expect(res.body.data).to.have.property('createdon');
            expect(res.body.data).to.have.property('status');
            expect(res.body.data).to.have.property('repaid');
            expect(res.body.data).to.have.property('tenor');
            expect(res.body.data).to.have.property('amount');
            expect(res.body.data).to.have.property('paymentinstallment');
            expect(res.body.data).to.have.property('balance');
            expect(res.body.data).to.have.property('interest');
            done(err);
          });
      });

      specify('error if user does not supply loan amount', (done) => {
        loanData = { amount: 0, tenor: 3 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if user supplies an invalid loan amount', (done) => {
        loanData = { amount: 'oss', tenor: 3 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if user does not provide loan tenor', (done) => {
        loanData = { amount: 20000, tenor: 0 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if user supplies an invalid tenor', (done) => {
        loanData = { amount: 20000, tenor: 13 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if token is not provided', (done) => {
        loanData = { amount: 20000, tenor: 3 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', '')
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(401);
            done(err);
          });
      });

      specify('error if an unverified user tries to make a loan request', (done) => {
        loanData = { amount: 20000, tenor: 3 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      specify('error if user tries to apply for a loan twice', (done) => {
        loanData = { amount: 20000, tenor: 3 };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });
  });

  describe('routes: User GET/Loans', () => {
    before((done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'uchiha.obito@akatsuki.org', password: 'user' })
        .end((err, res) => {
          userToken = res.body.data.token;
          done(err);
        });
    });

    it('should return all loan requests made by a user', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/user/loans`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
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
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
