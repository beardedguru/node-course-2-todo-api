// library imports
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
// set up for heroku
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// gets app ready to read from heroku port or local port
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/1234324
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({
      todo
    });
  }).catch((e) => {
    res.status(400).send();
  });

  // Todo.findById(id).then((todo) => {
  //   if (!todo) {
  //     res.status(404).send();
  //   } else {
  //     res.send({
  //       todo
  //     });
  //   }
  // }, (e) => {
  //   res.status(400).send();
  // })

});

module.exports = {
  app
};