module.exports = {
  "env": {
    "node": true,
    "es6": true,
  },
  "extends": "standard",
  "rules": {
    "semi": ['error', "always"],
    "comma-dangle": ['error', "always"],
  },
  "globals": {
    "after": true,
    "before": true,
    "beforeEach": true,
    "describe": true,
    "it": true,
    "models": true,
  },
};