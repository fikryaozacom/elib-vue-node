// const mongoose = require("mongoose");
const NodeCache = require("node-cache");
const crypto = require("crypto");
const borrowCache = new NodeCache();

const save = (userData) => {
  let borrows = borrowCache.get("borrow");
  if (!borrows) borrows = [];
  if (borrows.length > 0) {
    let userIsBorrow = borrows.filter((item) => item.user === userData.user);
    let checkBorrow = userIsBorrow.find(
      (item) => item.status === "Waiting Approval" || item.status === "Borrowed"
    );
    if (checkBorrow) return false;
  }
  userData.borrow_id = crypto.randomUUID();
  userData.status = "Waiting Approval";

  borrows.push(userData);

  borrowCache.set("borrow", borrows, 10000);
  return true;
};

const update = (userData) => {
  let borrows = borrowCache.get("borrow");
  if (borrows) {
    borrows.forEach((x) => {
      if (x.borrow_id === userData.borrow_id) {
        x.status = userData.status;
      }
    });
    borrowCache.set("borrow", borrows, 10000);
  }
};

const findAll = () => {
  let books = borrowCache.get("borrow");
  if (books) return books;
  return [];
};

const findOne = (query) => {
  let borrows = borrowCache.get("borrow");
  if (!borrows) return {};
  let userBorrow = [];
  borrows.forEach((item) => {
    if (item.user === query.user) userBorrow.push(item);
  });
  let borrow = borrows.find((x) => x.user === query.user);

  return userBorrow;
};

const Borrow = {
  save,
  findAll,
  findOne,
  update,
};

module.exports = Borrow;
