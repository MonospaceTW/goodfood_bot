const jwt = require('jsonwebtoken');
const debug = require('debug')('bc:auth:oauth');
const { promisify } = require('es6-promisify');
const crypto = require('crypto');
const config = require('config');

const signAsync = promisify(jwt.sign, jwt);
const randomBytesAsync = promisify(crypto.randomBytes, crypto);

const generateJwtId = async () => {
  try {
    let jti = await randomBytesAsync(32);
    return Promise.resolve(jti.toString('hex'));
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports.getCustomerToken = async (sid, type, showrefreshToken = true, admin = false) => {
  let payload = {
    sid,
    type,
    admin
  };
  let secret = config.jwt.secret;
  let { token } = await generateTokens(payload, secret);
  return Promise.resolve(token);
};

const getAccessTokenObject = async (payload, secret, opts) => {
  debug('### getAccessToken');
  try {
    const { auth } = config;
    const accessTokenId = await generateJwtId();
    debug('accessTokenId: %s', accessTokenId);
    const accessTokenPayload = Object.assign({}, payload, { jti: accessTokenId });
    const expiresIn = auth.expiresIn;
    const accessTokenOpts = Object.assign({}, {
      expiresIn
    }, opts);
    const accessToken = await signAsync(accessTokenPayload, secret, accessTokenOpts);
    return Promise.resolve({
      accessTokenId,
      accessToken
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

const getRefreshToken = async (payload, secret, accessTokenId, opts) => {
  debug('### getRefreshToken');
  try {
    const { auth } = config;
    const refreshTokenId = await generateJwtId();
    const refreshTokenPayload = Object.assign({}, payload, { jti: accessTokenId });
    debug('accessTokenId: %s \nrefreshTokenId: %s', accessTokenId, refreshTokenId);

    const refreshTokenOpts = Object.assign({}, {
      expiresIn: auth.expiresIn
    }, opts);
    const refreshToken = await signAsync(refreshTokenPayload, secret, refreshTokenOpts);
    return Promise.resolve(refreshToken);
  } catch (e) {
    return Promise.reject(e);
  }
};

const generateTokens = async (payload, secret, opts = {}) => {
  debug('### generateTokens');
  debug('payload: %j ,secret: %s, opts: %j', payload, secret, opts);
  try {
    const {accessTokenId, accessToken} = await getAccessTokenObject(payload, secret, opts);
    debug('payload: %j', payload);
    let { sid, type } = payload;
    const tTypes = { user: 0 };
    let tType = tTypes[type] || 0;
    const token = {
      sid,
      accessToken,
      tType
    };

    return Promise.resolve({
      accessToken,
      token
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
