const debug = require('debug');
const jwt = require('jsonwebtoken');
const config = require('config');
const namespace = 'services:jwt';
class JWT {
  constructor () {
    debug(namespace)('constructor');
  }

  async getDecoded (token) {
    try {
      let decoded = await jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch (error) {
      // 要丟客製化過的
      throw error;
    }
  }
}
module.exports = JWT;
