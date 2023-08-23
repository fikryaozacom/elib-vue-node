const NodeCache = require("node-cache");
const refreshTokenCache = new NodeCache();
const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

const createToken = (user) => {
  let expiredAt = new Date();

  expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

  let _token = uuidv4();

  refreshTokenCache.set(`_token`, {
    token: _token,
    user: user.email,
    expiryDate: expiredAt.getTime(),
  });
  return _token;
};

const verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

const findOne = (query) => {
  let refreshToken = refreshTokenCache.get(query.token);
  if (refreshToken) return refreshToken.token;
  else refreshToken;
};

const findByIdAndRemove = (token) => {
  let refreshToken = refreshTokenCache.take(token);
};

const RefreshToken = {
  createToken,
  verifyExpiration,
  findOne,
  findByIdAndRemove,
};

module.exports = RefreshToken;
