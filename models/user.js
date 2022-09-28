'use strict';
const bcrypt = require('bcrypt');
const {
    Model,
    UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        toJSON() {
            return {...this.get(), id: undefined }
        };
    };
    User.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        userName: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'User'
        }
    }, {
        sequelize,
        tableName: 'users',
        modelName: 'User',
        hooks: {
            beforeCreate: async(record, options) => {
                const saltRounds = 12;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(record.dataValues.password, salt);
                record.password = hashedPassword;
            }
        }
    });
    return User;
};