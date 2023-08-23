const NodeCache = require("node-cache");
const roleCache = new NodeCache();
const save = (userData) => {
  roleCache.set("role", userData, 10000);
};

const find = (query) => {
  let roles = roleCache.get("role");
  let role = roles.find((x) => x.name === query.role);
  return role;
};

const Role = {
  find,
};

module.exports = Role;
