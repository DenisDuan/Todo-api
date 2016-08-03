/**
 * The url of the app on Heroku is: https://denis-todo-api.herokuapp.com/
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

var PORT = process.env.PORT || 3000; // the first is used to get the environment varialbe, which is the PORT#
var todos = [];
var todoNextId = 1;

// Use the middleware 'body parser' to handle JSON data from post request
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// GET /todos : get all todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

// GET /todo/:id get a single todo
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// DELETE /todo/:id deletes a single todo
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    } else {
        res.status(404).json({"error" : "no todo with that given id"});
    }
});

// POST /todos - create TODO
app.post('/todos', function (req, res) {
    // "_.pick" works on pick out only fields that required 
    var body = _.pick(req.body, ["description", "completed"]);

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();

    if (body) {
        body.id = todoNextId++;
        todos.push(body);
    }

    res.json(body);
});

// PUT /todos/:id - update todo
app.put('/todos/:id', function (req, res) {
    // "_.pick" works on pick out only fields that required 
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if (!matchedTodo) {
        return res.status(400).send();   
    }

    var body = _.pick(req.body, ["description", "completed"]);
    var validAttributes = {};

    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    matchedTodo = _.extend(matchedTodo, validAttributes);

    res.json(body);
});


// Listen to the incoming request on port specified
app.listen(PORT, function () {
    console.log('Express listening on port: ' + PORT +'!');
});