const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  } 
  return res.status(404).json({message: "Unable to register user. Provide a username and password"});
});


/* TASK 1
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});
*/

// TASK 10
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 1000);
  });
   try{
    const data = await promise;
    return res.status(200).send(JSON.stringify(data));
   } catch(error) {
    return res.status(500).send(error);
   }
});


/* TASK 2
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
 });
*/

// TASK 11
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const selectedBook = books[isbn];
      if(selectedBook) {
        resolve(selectedBook);
      } else {
        reject('Book not found');
      }
    }, 1000);
  });

  try{
    const data = await promise;
    return res.status(200).send(JSON.stringify(data));
   } catch(error) {
    return res.status(404).send(error);
   }
 });


/* TASK 3
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];
  for(const key in books) {
    if(author === books[key].author) {
      const { title, reviews } = books[key];
      filteredBooks.push({
        isbn: key,
        title,
        reviews,
      });
    }
  }
  return res.status(200).json({booksByAuthor: filteredBooks});
});
*/

// TASK 12
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let filteredBooks = [];
      for(const key in books) {
        if(author === books[key].author) {
          const { title, reviews } = books[key];
          filteredBooks.push({
            isbn: key,
            title,
            reviews,
          });
        }
      }
      resolve(filteredBooks);
    }, 1000);
  });

  try{
    const data = await promise;
    return res.status(200).send(JSON.stringify(data));
   } catch(error) {
    return res.status(500).send(error);
   }
});


/* TASK 4
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];
  for(const key in books) {
    if(title === books[key].title) {
      const { author, reviews } = books[key];
      filteredBooks.push({
        isbn: key,
        author,
        reviews,
      });
    }
  }
  return res.status(200).json({booksByTitle: filteredBooks});
});
*/

// TASK 13
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let filteredBooks = [];
      for(const key in books) {
        if(title === books[key].title) {
          const { author, reviews } = books[key];
          filteredBooks.push({
            isbn: key,
            author,
            reviews,
          });
        }
      }
      resolve(filteredBooks);
    }, 1000);
  });

  try{
    const data = await promise;
    return res.status(200).send(JSON.stringify(data));
   } catch(error) {
    return res.status(500).send(error);
   }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const selectedBook = books[isbn];

  if(selectedBook) {
    return res.status(200).send(selectedBook.reviews);
  }
  return res.status(404).send('Book not found with that ISBN');
});

module.exports.general = public_users;
