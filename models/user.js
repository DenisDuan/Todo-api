// Data model for USER 

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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [7, 100]
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
        }
    });
};