const MsgResponse = require('../utils/MsgResponse');
const debug = require('debug')('bc:auth:user');
const passport = require('passport');
const { Strategy } = require('passport-local');
const LocalStrategy = Strategy;
const { getCustomerToken, checkRefreshToken } = require('./oauth');

const BASE_TYPE = 'user';
const STRATEGY_NAME = BASE_TYPE;

async function verify (email, password, done) {
  debug('# verify');
  let driver = await userService.findByUsername(username);
  let isAble = await userService.auth(username, password);
  let options;
  let error = null;

  if (user) {
    if (!isAble) {
      error = new MsgResponse(config.err.BAD_PASSWORD);
    }
  } else {
    error = new MsgResponse(config.err.USER_NOT_FOUND);
  }

  // pass to driverAuthHandler
  done(error, user, options);
}

passport.use(STRATEGY_NAME, new LocalStrategy(verify));

export const driverAuthHandler = (ctx, next) => {
  debug('### driverAuthHandler');
  return passport.authenticate(STRATEGY_NAME, async (err, user, options) => {
    debug('err: %j, user: %j, options: %j', err, user, options);
    if (err) throw err;

    let token = await getCustomerToken(user.id, BASE_TYPE);
    ctx.body = token;
  })(ctx, next);
};

// export const driverRefreshToken = async (ctx) => {
//   debug('### driverRefreshToken');
//   let authorization = ctx.request.header.authorization;
//   let token = await checkRefreshToken(authorization);
//   let driver = await models.Driver.findById(token.sid);
//   let newToken = await getCustomerToken(driver.id, BASE_TYPE, false);
//   ctx.body = newToken;
// };

export const checkPermission = async (ctx, next) => {
  let type = ctx.state.user.type;
  if (type === BASE_TYPE) {
    await next();
  } else {
    throw new MsgResponse(config.err.BAD_ACCESS_TOKEN);
  }
};

export default passport;
