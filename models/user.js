// Data model for USER 
var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
    var user =  sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // setting the 'unique' to true means there's only email data will be unique across all records
            unique: true,
            validate: {
                // Setting this will validate the email automatically
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            // Happen before actually setting the value to field
            set: function(value) {
                // Salt and hast the user entered password
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        /**
         * Hooks (also known as callbacks or lifecycle events), 
         * are functions which are called before and after calls in sequelize are executed.
         * 
         * The following hook use to normalize email so that the "unique" validation can be performed. 
         */
        hooks: {
            beforeValidate: function(user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        /**
         * This is like adding static mathod in Java 
         */
        classMethods: {
            authenticate: function(body) {
                return new Promise(function(resolve, reject) {
                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }

                    user.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function(user) {
                        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                            return reject()
                        }
                        resolve(user);
                    }, function(e) {
                        reject();
                    })
                });

            }
        },
        /**
         * This shows how to add a method for an instance of record
         */
        instanceMethods: {
            toPublicJSON: function() {
                var json = this.toJSON();
                // Only shows certain data to the user
                return _.pick(json, ['id', "email", 'createdAt', 'updatedAt']);
            }
        }
    });

    return user;
};