const config = require("../config/auth.config");
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // const user = new User({
  //   email: req.body.email,
  //   password: bcrypt.hashSync(req.body.password, 8),
  // });
  User.save({
    email: req.body.email,
    role: "USER",
    password: bcrypt.hashSync(req.body.password, 8),
  });
  res.send({ message: "User was registered Successfully!" });
};

exports.signin = async (req, res) => {
  let user = User.findOne(
    {
      email: req.body.email,
    },
    "email"
  );

  if (!user) {
    return res.status(404).send({ message: "User Not Found." });
  }
  let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  let token = jwt.sign({ id: user.email }, config.secret, {
    expiresIn: config.jwtExpiration, //24hours
  });

  let refreshToken = await RefreshToken.createToken(user);

  let authorities = [];

  authorities.push("ROLE_" + user.role.toUpperCase());

  res.status("200").send({
    // id: user._id,
    email: user.email,
    roles: authorities,
    accessToken: token,
    refreshToken: refreshToken,
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res
        .status(403)
        .json({ message: "Refresh token is not in the database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken);

      res.status(403).json({
        message: "Refresh token was expired. Please Make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
