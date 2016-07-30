/**
 * The url of the app on Heroku is: https://denis-todo-api.herokuapp.com/
 */

var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

// TODO collections
var todos = [{
    id: 1,
    description: 'Shopping',
    completed: false
}, {
    id: 2,
    description: 'Play Pokemon go',
    completed: false
},{
    id: 3,
    description: 'Call mum',
    completed: true
}];


app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// GET /todos : get all todos
app.get('/todos', function (req, res) {
    res.json(todos);
});
// GET /todo/:id get a single todo


app.listen(PORT, function () {
    console.log('Express listening on port: ' + PORT +'!');
});