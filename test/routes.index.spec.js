import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';

describe('routes /, /404, /api/v1', () => {
  it('should return the index page', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return the API page', (done) => {
    chai
      .request(app)
      .get(baseURI)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return an error for any invalid route', (done) => {
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
