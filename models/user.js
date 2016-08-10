// Data model for USER 
var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
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
            set: function(value) {
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
        instanceMethods: {
            toPublicJSON: function() {
                var json = this.toJSON();
                return _.pick(json, ['id', "email", 'createdAt', 'updatedAt']);
            }
        }
    });
};