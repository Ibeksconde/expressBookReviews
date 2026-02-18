const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const API_URL = "http://localhost:5000";

// Task 10: Get book list using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const response = await Promise.resolve(books); // Simulating async retrieval
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "ISBN not found" });
        }
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on Author using Async/Await
// public_users.get('/author/:author', async function (req, res) {
//     const author = req.params.author;
//     try {
//         const bookList = await Promise.resolve(Object.values(books));
//         const filteredBooks = bookList.filter(b => b.author === author);
//         res.status(200).json(filteredBooks);
//     } catch (error) {
//         res.status(500).json({ message: "Error searching by author" });
//     }
// });

// Task 12: Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    // Simulating an asynchronous database search
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filtered_books = keys
          .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
          .map(key => ({ isbn: key, ...books[key] }));

        if (filtered_books.length > 0) {
          resolve(filtered_books);
        } else {
          // Task-specific error: No book found
          reject({ status: 404, message: `No books found with the title: ${title}` });
        }
      });
    };

    const result = await getBooksByTitle();
    return res.status(200).send(JSON.stringify(result, null, 4));

  } catch (error) {
    // Handles both the 404 (Not Found) and potential 500 (Server Error)
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      message: error.message || "An internal error occurred while fetching the book."
    });
  }
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve) => {
        let results = Object.values(books).filter(b => b.title === title);
        resolve(results);
    })
    .then(results => res.status(200).json(results));
});

module.exports.general = public_users;
