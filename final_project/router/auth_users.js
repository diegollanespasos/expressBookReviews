const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return !users.find(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
  let validUsers = users.filter(user=> (user.username === username && user.password === password));
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const bookReview = req.query.review;
  const username = req.session.authorization['username'];

  const selectedBook = books[isbn];
  if(selectedBook) {
    selectedBook.reviews[username] = bookReview;
    return res.status(200).json({message: `The review for the book with ISB ${isbn} has been added/updated`, updatedBooks: books });
  } else {
    return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

// Delete a movie review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization['username'];

  const selectedBook = books[isbn];
  if(selectedBook) {
    delete selectedBook.reviews[username];
    return res.status(200).json({message: `The review for the book with ISB ${isbn} has been deleted for user ${username}`, updatedBooks: books });
  } else {
    return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
