/**
 * The url of the app on Heroku is: https://denis-todo-api.herokuapp.com/
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');

var PORT = process.env.PORT || 3000; // the first is used to get the environment varialbe, which is the PORT#
var todos = [];
var todoNextId = 1;

// Use the middleware 'body parser' to handle JSON data from post request
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

/**
 * The following part is for API for TODO
 */

// GET /todos?completed=true&q={text to search in description}
app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var where = {};

    // Find todos base on the 'completed' attribute
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        where.completed = true;
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        where.completed = false;
    }

    // Add to the query base on the description
    if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
        where.description = {
            $like: '%' + queryParams.q.trim() + '%'
        };
    }

    db.todo.findAll({
        where: where
    }).then(function(todos) {
        res.json(todos);
    }, function(e) {
        res.status(500).send();
    });
});

// GET /todo/:id get a single todo
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function(todo) {
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    })
});

// DELETE /todo/:id deletes a single todo
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(400).send({
                error: 'No todo with id'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
});

// POST /todos - create TODO
app.post('/todos', function(req, res) {
    // "_.pick" works on pick out only fields that required 
    var body = _.pick(req.body, ["description", "completed"]);

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
});

// PUT /todos/:id - update todo
app.put('/todos/:id', function(req, res) {
    // "_.pick" works on pick out only fields that required 
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attribute = {};

    if (body.hasOwnProperty('completed')) {
        attribute.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attribute.description = body.description;
    }

    db.todo.findById(todoId).then(function(todo) {
        // Update the record if the record exist
        if (todo) {
            // Execute the promise after upate
            todo.update(attribute).then(function(todo) {
                res.json(todo.toJSON()); // Send the updated record back if updated successfully 
            }, function(e) {
                res.status(400).json(e); // Send 400 if somehow update failed.
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send(); // Send 500 if anything when wrong when fetch the record
    });

});


/**
 * The following part is for API for USER
 */

// POST /users - create USER
app.post('/users', function(req, res) {
    // "_.pick" works on pick out only fields that required 
    var body = _.pick(req.body, ["email", "password"]);

    db.user.create(body).then(function(user) {
        res.json(user.toPublicJSON());
    }, function(e) {
        res.status(400).json(e);
    });
});

// POST /users/login

app.post('/users/login', function(req, res) {
    // "_.pick" works on pick out only fields that required 
    var body = _.pick(req.body, ["email", "password"]);

    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
        res.status(400).send();
    }

    db.user.findOne({
        where: {
            email: body.email
        }
    }).then(function(user) {
        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
            return res.status(401).send();
        } 
        
        res.json(user.toPublicJSON());
    }, function(e) {
        res.status(500).send();
    })
});

// Sync database 
db.sequelize.sync().then(function() {
    // Listen to the incoming request on port specified
    app.listen(PORT, function() {
        console.log('Express listening on port: ' + PORT + '!');
    });
});