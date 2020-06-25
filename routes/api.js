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
        let db = client.db('personal-library');
        db.collection('books')
        .find({})
        .toArray((err, docs) => {

          let result;

          result = docs.map((ele, i, arr) => {
            let obj = {};
            obj._id = arr[i]._id;
            obj.title = arr[i].title;
            obj.commentcount = !arr[i].comments ? 0 : arr[i].comments.length;
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
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        let db = client.db('personal-library');

        db.collection('books').deleteMany({}, (err, doc) => {
          (err) ? res.send('Delete unsuccessful') : res.send('complete delete successful');
        })
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client)=> {
        let db = client.db('personal-library');

        db.collection('books').find({_id: ObjectId(bookid)}).toArray((err, doc)=>{
          expect(err, 'error').to.not.exist;
          doc.length === 0 ? res.send('sorry that book does not exist') : res.json(doc[0])
        })
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      var update = { comments: [] };
      //json res format same as .get

      if (!bookid) {  
        res.send('no id given')
      }
      if (!comment) {
        res.send('no comment provided')
      }

      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {

        let db =client.db('personal-library');

        db.collection('books').findAndModify({_id: ObjectId(bookid)},
        {},
        {$push: { comments: comment}},
        {new: true},
        (err, doc) => {
          (err) ?  res.send('comment adding was unsuccessful') : res.json(doc.value);
        })
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        let db = client.db('personal-library');

        db.collection('books').remove({_id: ObjectId(bookid)}, (err, doc) => {
          (err) ? res.send('delete unsuccessful') : res.send('delete successful');
        })
      })
    });
  
};
