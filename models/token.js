"use strict";
const { Model } = require("sequelize");
const { TOKEN_ACTIVE } = require("../modules/user/user.constant");

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      value: DataTypes.STRING,
      type: DataTypes.STRING,
      expiredDate: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: TOKEN_ACTIVE,
      },
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
      modelName: "Token",
      timestamps: true,
    }
  );
  return Token;
};
