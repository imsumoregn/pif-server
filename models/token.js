"use strict";
const { Model } = require("sequelize");
const { TOKEN_ACTIVE } = require("../modules/mentee/mentee.constant");
module.exports = (sequelize, DataTypes) => {
  class token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  token.init(
    {
      value: DataTypes.STRING,
      type: DataTypes.STRING,
      expiredDate: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: TOKEN_ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "token",
    }
  );
  return token;
};
