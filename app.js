const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// Port
const port = process.env.PORT || 3000;

// Init app
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://test:test@ds143340.mlab.com:43340/todoapp'; //URL to the todoapp database

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //Set the view to ejs

// Connect to mongodb
MongoClient.connect(url, (err, database) => {
  console.log('MongoDB Connected...');
  if(err) throw err;

  db = database;
  Todos = db.collection('todos');

  app.listen(port, () => {
    console.log('Server running on port '+port);
  });
});

app.get('/', (req, res, next) => {
  Todos.find({}).toArray((err, todos) => {
    if(err){
      return console.log(err);
    }
    res.render('index',{
      todos: todos
    });
  });
});


app.post('/todo/add', (req, res, next) => {
  // Create todo
  const todo = {
    text: req.body.text, //Using req.body.text because of the name attribute in index.ejs is text
    body: req.body.body //Using req.body.body because of the name attribute in index.ejs is body
  }

  //Insert todo
  Todos.insert(todo, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('Todo Added...');
    res.redirect('/');
  });
});


app.delete('/todo/delete/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)} //Have to wrap it in OjbectID because the id is an object id
  Todos.deleteOne(query, (err, response) => {
    if (err) {
      return console.log(err);
    }
    console.log('Todo Removed');
    res.send(200);
  });
});


app.get('/todo/edit/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)}
  Todos.find(query).next((err, todo) => {
    if(err){
      return console.log(err);
    }
    res.render('edit', {
      todo: todo
    });
  });
});


app.post('/todo/edit/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)} //This will get the single todo ite.
  // Create todo
  const todo = {
    text: req.body.text, //Using req.body.text because of the name attribute in index.ejs is text
    body: req.body.body //Using req.body.body because of the name attribute in index.ejs is body
  }

  //Update todo
  //The todo in $set:todo is from the variable todo
  Todos.updateOne(query, {$set:todo}, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('Todo Updated...');
    res.redirect('/');
  });
});