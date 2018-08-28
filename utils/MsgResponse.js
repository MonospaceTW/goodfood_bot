// var debug = require('debug')('bc:utils:MsgResponse');
const config = require('config');
module.exports = class MsgResponse extends Error {
  constructor (message) {
    super();
    var err = message;

    if (!err) {
      return new MsgResponse(config.err.ERROR_UNDEFINED);
    }

    err = err.split(' ');

    this.code = parseInt(err[0], 10);
    this.name = err[1];
    this.message = err[2];
    this.status = 400;

    switch (this.name) {
      case 'BAD_ACCESS_TOKEN':
        this.status = 403;
        break;
      default:
        this.status = 400;
        break;
    }

    // Error.captureStackTrace(this, message);
    return this;
  }
};
