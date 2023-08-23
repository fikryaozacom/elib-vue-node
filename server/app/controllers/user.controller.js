const db = require("../models");
const User = db.user;
const Book = db.book;
const Borrow = db.borrow;

exports.allAccess = (req, res) => {
  res.status(200).send("Welcome to E-Library.");
};

exports.listBook = (req, res) => {
  res.status(200).json(Book.findAll());
};

exports.borrow = (req, res) => {
  let insert = Borrow.save(req.body);
  if (insert) res.status(200).json({ message: "Borrow Submitted" });
  else
    res.status(500).json({
      message: "Cannot borrow at same time. Please Return Or Cancel It First",
    });
};

exports.borrowUpdate = (req, res) => {
  let insert = Borrow.update(req.body);
  res.status(200).json({ message: "Borrow Submitted" });
};

exports.bookById = (req, res) => {
  res.status(200).json(Book.findOne(req.params.id));
};

exports.userBoard = (req, res) => {
  let status = {
    borrow: Borrow.findOne({ user: req.userId }),
  };
  res.status(200).json(status);
};

exports.adminBoard = (req, res) => {
  let borrow = Borrow.findAll({ user: req.userId });
  res.status(200).json({ data: borrow });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
