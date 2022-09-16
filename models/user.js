"use strict";
const { Model } = require("sequelize");
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

    generateAuthToken() {
      return jwt.sign(
        {
          ..._.pick(this, ["id", "email", "name", "isConfirmed", "isActive"]),
        },
        process.env.JWT_SECRET_KEY
      );
    }

    generateTemporaryAuthToken() {
      return jwt.sign(
        {
          ..._.pick(this, ["id"]),
          createdAt: Date.now(),
        },
        process.env.JWT_SECRET_KEY
      );
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
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
    }
  );
  return User;
};
