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
    });
};