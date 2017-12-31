// Include MongoClient
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MoongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a481bdeccfc8c37a8a67b7b')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  // db.collection('Users').findOneAndUpdate({
  //   _id: new ObjectID('5a481d46abad4524708f99bd')
  // }, {
  //   $set: {
  //     name: 'Charles'
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((results) => {
  //   console.log(results);
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a481d46abad4524708f99bd')
  }, {
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((results) => {
    console.log(results);
  })

// db.close();
});