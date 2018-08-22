module.exports = {
  "env": {
    "node": true,
    "es6": true,
  },
  "extends": "standard",
  "rules": {
    "semi": ['error', "always"],
    "comma-dangle": ['error', "only-multiline"],
  },
  "globals": {
    "after": true,
    "before": true,
    "beforeEach": true,
    "afterEach": true,
    "describe": true,
    "it": true,
    "express": true,
    "logResponseBody": true,
    "request": true,
    "models": true,
    "config": true,
    "expect": true,
    "faker": true,
  },
};