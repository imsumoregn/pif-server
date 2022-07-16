"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mentor extends Model {
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
  Mentor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      location: DataTypes.STRING,
      linkedin: DataTypes.STRING,
      github: DataTypes.STRING,
      bookingUrl: DataTypes.STRING,
      scopes: DataTypes.ARRAY(DataTypes.STRING),
      fields: DataTypes.ARRAY(DataTypes.STRING),
      offers: DataTypes.ARRAY(DataTypes.STRING),
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: "SET DEFAULT",
      },
    },
    {
      sequelize,
      modelName: "Mentor",
      timestamps: true,
    }
  );
  return Mentor;
};
