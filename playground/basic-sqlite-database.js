var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({
    force: true
}).then(function() {
    console.log('Everything is in Sync.');
    Todo.create({
        description: 'Take out the trash'
    }).then(function() {
        return Todo.create({
            description: 'Clean the office'
        })
    }).then(function() {
        return Todo.findAll({
            where: {
                description: {
                    $like: '%trash'
                }
            }
        });
    }).then(function(todos) {
        if (todos) {
            todos.forEach(function(todo) {
                console.log(todo.toJSON());
            });
        } else {
            console.log('no todo found');
        }
    });

});