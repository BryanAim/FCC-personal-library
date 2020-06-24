/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

require('dotenv').config();
const MONGODB_CONNECTION_STRING = process.env.DB;
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        let db = client.db('books');
        db.collection('books')
        .find({})
        .toArray((err, docs) => {
          let result;
          results = docs.map((ele, i, arr) => {
            let obj = {};
            obj._id = arr[i].comments? 0 : arr[i].comments.length;
            return obj;
          })
          res.json(result)
        })
      })
    })
    
    .post(function (req, res){
      
      var title = req.body.title;
      var book = { title };
      //response will contain new book object including atleast _id and title


      if (!title) {
        res.send("No title added")
      } else {
        
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {

        let book = {
          bookTitle: title
        }
        let db = client.db('personal-library');
      
        db.collection('books').insertOne(book, function (err, doc) {
          if (err) {
            console.log("Error saving to db ", err);
            
          } else {
            console.log("Successfully saved");
            
            res.json(book)
          }
        })
      })
      }

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {

        let book = {
          // bookTitle: title,
          // _id: _id,
          comment: comment
        }
        let db =client.db('personal-library');

        db.collection('book').insertOne(book, function(err, doc) {
          if (err) {
            console.log("error", err);
            
          } else {
            res.json(book)
          }
        })
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
