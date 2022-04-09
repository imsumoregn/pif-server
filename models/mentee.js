"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mentee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mentee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      memberSince: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      dob: DataTypes.DATE,
      isConfirmedEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      avatarUrl: DataTypes.STRING,
      schools: DataTypes.ARRAY(DataTypes.STRING),
      exp: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "Mentee",
    }
  );

  Mentee.prototype.generateAuthToken = () => {
    return jwt.sign(
      {
        ..._.pick(this, [
          "id",
          "email",
          "name",
          "isConfirmedEmail",
          "isActive",
        ]),
      },
      process.env.JWT_SECRET_KEY
    );
  };

  Mentee.prototype.generateTemporaryAuthToken = () => {
    const realtime = Date.now();
    return jwt.sign(
      {
        ..._.pick(this, ["id"]),
        createdAt: realtime,
      },
      process.env.JWT_SECRET_KEY
    );
  };

  return Mentee;
};
