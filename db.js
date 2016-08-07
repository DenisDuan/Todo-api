/**
 * Steps to get postgres database running on Heroku
 * 
 * 1. Install addon on Heroku:
 *    heroku addons:create heroku-postgresql:hobby-dev
 * 
 * 2. Wait for Heroku finishes installing pg
 *    heroku pg:wait
 * 
 * 3. Install postgres on the project:
 *    npm install pg@4.4.1 --save
 * 
 * 4. Install postgres hstore module:
 *    npm install pg-hstore@2.3.2 --save
 * 
 * 5. Configure the sequelize configruation file using environment variable. e.g. shown in this file 
 * 
 * 6. Push the changes to Heroku
 *    
 */

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}

// Creates the wrapper object
var db = {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;