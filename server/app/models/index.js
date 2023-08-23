const NodeCache = require("node-cache");

// const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

const db = {};

// db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");
db.book = require("./book.model");
db.borrow = require("./borrow.model");

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
