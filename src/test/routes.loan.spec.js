import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import DB from '../database/dbconnection';
import HelperUtils from '../utils/helperUtils';
import dropTables from '../database/dropTables';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const authURI = '/api/v1/auth';

const hashedPassword = HelperUtils.hashPassword('secret');
let userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc2FkbWluIjpmYWxzZSwic3RhdHVzIjoidW52ZXJpZmllZCIsImlhdCI6MTU1ODQ1MTMzMiwiZXhwIjoxNTU4NTM3NzMyfQ.d2sNOHanRMYmkzWspKEjqZB5c2ni6ythCl9l8_75fV8';
let adminToken;

describe('routes: loan', () => {
  describe('routes: Admin /loans', () => {
    beforeEach(async () => {
      await DB.query(`INSERT INTO users(firstname, lastname, address, email, password, isadmin, status)  VALUES('Desmond', 'Edem', 'Sabo', 'meetdesmond.edem@gmail.com', '${hashedPassword}', 'true', 'verified');`);
      await DB.query(`
      INSERT INTO loans(email,status,repaid,tenor,amount,paymentInstallment,balance, interest)
      VALUES('uchiha.obito@akatsuki.org','pending','false',3,20000,7000,21000,1000);`);

      const res = await chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'meetdesmond.edem@gmail.com', password: 'secret' });
      adminToken = res.body.data.token;
      console.log(adminToken);
    });

    afterEach((done) => {
      DB.query(dropTables);
    });

    context('GET /loans', () => {
      it('should fetch all loan applications', async () => {
        const res = await chai
          .request(app)
          .get(`${baseURI}/loans`)
          .set('authorization', `Bearer ${adminToken}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
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

    context.skip('GET /loans/?status&repaid', () => {
      it('should return all loans that are approved and fully repaid', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans?status=approved&repaid=true`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
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

    context.skip('GET /loans/:<loan-id>', () => {
      it('should fetch a specific loan application', (done) => {
        chai
          .request(app)
          .get(`${baseURI}/loans/1`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('id');
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
          .set('authorization', `${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });

    context.skip('PATCH /loans/<:loan-id>', () => {
      const data = { status: 'approved' };

      specify('error if patch options are not the accepted value', (done) => {
        const error = { status: 'yes' };
        chai
          .request(app)
          .patch(`${baseURI}/loans/1`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(error)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      it('should update loan status successfully', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/1`)
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

      specify('error if admin approves an already approved loan', (done) => {
        chai
          .request(app)
          .patch(`${baseURI}/loans/1`)
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
          .patch(`${baseURI}/loans/9`)
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

  describe.skip('routes: User /loans', () => {
    context('POST /loans', () => {
      before((done) => {
        chai
          .request(app)
          .post(`${authURI}/signin`)
          .send({ email: 'john.doe@email.com', password: 'secret' })
          .end((err, res) => {
            userToken = res.body.data.token;
            done(err);
          });
      });

      let loanData;

      it('specify error if token is not provided', (done) => {
        loanData = {
          amount: 20000,
          tenor: 3,
        };
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

      specify('error if user does not supply loan amount', (done) => {
        loanData = {
          amount: 0,
          tenor: 3,
        };
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
        loanData = {
          amount: 'oss',
          tenor: 3,
        };
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
        loanData = {
          amount: 20000,
          tenor: 0,
        };
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
        loanData = {
          amount: 20000,
          tenor: 13,
        };
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

      it('should create a new loan record', (done) => {
        loanData = {
          amount: 20000,
          tenor: 3,
        };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done(err);
          });
      });

      specify('error if user tries to apply for a loan twice', (done) => {
        loanData = {
          amount: 20000,
          tenor: 3,
        };
        chai
          .request(app)
          .post(`${baseURI}/loans`)
          .set('authorization', `Bearer ${userToken}`)
          .send(loanData)
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });
  });

  describe.skip('routes: /User /Loans', () => {
    before((done) => {
      chai
        .request(app)
        .post(`${authURI}/signin`)
        .send({ email: 'uchiha.obito@akatsuki.org', password: 'secret' })
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
