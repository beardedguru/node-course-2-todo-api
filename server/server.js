require('./config/config');
// library imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

// local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// set up for heroku
const port = process.env.PORT;

// set our main app to use Express()
var app = express();

// middleware
app.use(bodyParser.json());

///////////////////////////////////////
// create a new todos on the /todos url
///////////////////////////////////////
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

////////////////////////////////////////////////////////
// gets app ready to read from heroku port or local port
////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
})

//////////////////////////////////////////////
// gets every todos from the /todos collection
//////////////////////////////////////////////
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

///////////////////////////////////////
// Search for todos related to this :id
///////////////////////////////////////
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

/////////////////////////////////////////////////
// Delete todos that are associated with this :id
/////////////////////////////////////////////////
app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;
  // validate the id -> not valid? return 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    // if no doc, send 404
    if (!todo) {
      return res.status(404).send();
    }
    // success
    // if doc, send doc back with a 200
    res.send({
      todo
    });
  }).catch((e) => {
    // error
    // 400 with empty body
    res.status(400).send();
  });
});

/////////////////////////////////////////////////
// Update todos that are associated with this :id
/////////////////////////////////////////////////
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {

    if (!todo) {
      return resizeBy.status(404).send();
    }

    res.send({
      todo
    });

  }).catch((e) => {
    res.status(400).send();
  })
})

/////////////////////////////////////////////////////////////
// POST /users create new user registration in the /todos app
/////////////////////////////////////////////////////////////
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  User.findByToken
  user.generateAuthToken

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});


module.exports = {
  app
};