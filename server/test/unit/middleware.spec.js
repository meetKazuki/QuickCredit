import sinon from 'sinon';
import chai from 'chai';
import AuthenticateUser from '../../src/middleware/authenticateUser';

const should = chai.should();

describe('Middleware', () => {
  context('verifyAuthHeader()', () => {
    specify('an error on missing Authorization Header', (done) => {
      const callback = sinon.spy();
      const request = {
        headers: { authorization: '' },
      };
      const response = {};

      AuthenticateUser.verifyAuthHeader(request, response, callback);
      callback.calledOnce.should.equal(false);
      done();
    });

    specify('an error on invalid token format', (done) => {
      const callback = sinon.spy();
      const request = {
        headers: { authorization: 'Bearer' },
      };
      const response = {};

      AuthenticateUser.verifyAuthHeader(request, response, callback);
      callback.calledOnce.should.equal(false);
      done();
    });
  });
});
