const MsgResponse = require('../utils/MsgResponse');
const debug = require('debug')('bc:auth:user');
const passport = require('passport');
const { Strategy } = require('passport-local');
const LocalStrategy = Strategy;
const { getCustomerToken, checkRefreshToken } = require('./oauth');

const BASE_TYPE = 'user';
const STRATEGY_NAME = BASE_TYPE;

passport.use(STRATEGY_NAME, new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
async function (email, password, done) {
  let user = await userService.findUserByEmail(email);
  let isAble = await userService.auth(email, password);
  let error = null;
  if (user) {
    if (!isAble) {
      error = new MsgResponse(config.err.BAD_PASSWORD);
    }
  } else {
    error = new MsgResponse(config.err.USER_NOT_FOUND);
  }
  done(error, user);
}
));

module.exports.userAuthHandler = (req, res, next) => {
  debug('### userAuthHandler');
  console.log(req.body);
  passport.authenticate(STRATEGY_NAME, async (error, user) => {
    let token = await getCustomerToken(user.id, BASE_TYPE);
    console.log('token => ', token);
    res.json(token);
  })(req, res, next);
};

// export const driverRefreshToken = async (ctx) => {
//   debug('### driverRefreshToken');
//   let authorization = ctx.request.header.authorization;
//   let token = await checkRefreshToken(authorization);
//   let driver = await models.Driver.findById(token.sid);
//   let newToken = await getCustomerToken(driver.id, BASE_TYPE, false);
//   ctx.body = newToken;
// };

module.exports.checkPermission = async (ctx, next) => {
  let type = ctx.state.user.type;
  if (type === BASE_TYPE) {
    await next();
  } else {
    throw new MsgResponse(config.err.BAD_ACCESS_TOKEN);
  }
};

module.exports.passport;
