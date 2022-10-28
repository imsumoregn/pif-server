"use strict";
const {Model} = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const {REFRESH_TOKEN} = require("../modules/user/user.constant");

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

        generateClientAuthToken(type) {

            return jwt.sign(
                {
                    id: this.id,
                },
                process.env.CLIENT_JWT_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_ALIVE_MINUTES,
                    audience: type,
                },
            );

        }

        generateAuthToken(type) {

            return jwt.sign(
                {
                    id: this.id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: type === REFRESH_TOKEN
                        ? process.env.REFRESH_TOKEN_ALIVE_DAYS
                        : process.env.ACCESS_TOKEN_ALIVE_MINUTES,
                    audience: type,
                },
            );

        }
    }

    User.init(
        {
            id: {
                type: DataTypes.STRING,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            method: DataTypes.STRING,
            name: DataTypes.STRING,
            phone: DataTypes.STRING,
            exp: DataTypes.JSON,
            school: DataTypes.STRING,
            birthday: DataTypes.DATE,
            role: DataTypes.STRING,
            description: DataTypes.STRING,
            memberSince: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            isActive: DataTypes.BOOLEAN,
            isConfirmed: DataTypes.BOOLEAN,
            avatar: DataTypes.STRING,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                onUpdate: "SET DEFAULT",
            },
        },
        {
            sequelize,
            modelName: "User",
            timestamps: true,
            hooks: {
                beforeCreate: async (user) => {
                    const salt = await bcrypt.genSalt(Number(process.env.SALT_USER_PW));
                    user.password = await bcrypt.hash(user.password, salt);
                },
            },
        },
    );

    return User;

};
