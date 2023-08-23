// const mongoose = require("mongoose");
const NodeCache = require("node-cache");
const userCache = new NodeCache();

const save = (userData) => {
  let users = userCache.get("user");
  users.push(userData);
  userCache.set("user", users, 10000);
};

const findOne = (query, field = "username") => {
  let users = userCache.get("user");
  if (!users) {
    let data = [
      {
        email: "user@gmail.com",
        role: "USER",
        password:
          "$2a$08$ozntgL5YQBDCPB6LNmW1negMKCihBiRdDFSGnk02IVlr2o74OYMM.",
      },
      {
        email: "admin@gmail.com",
        role: "ADMIN",
        password:
          "$2a$08$ozntgL5YQBDCPB6LNmW1negMKCihBiRdDFSGnk02IVlr2o74OYMM.",
      },
    ];
    userCache.set("user", data);
  }
  users = userCache.get("user");
  let user =
    field === "username"
      ? users.find((x) => x.username === query.username)
      : users.find((x) => x.email === query.email);
  return user;
};

const User = {
  save,
  findOne,
};

module.exports = User;
