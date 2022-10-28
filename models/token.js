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
      value: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Token",
      timestamps: true,
    }
  );
  return Token;
};
