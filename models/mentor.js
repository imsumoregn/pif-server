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
  }
  Mentor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      memberSince: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      hobbies: DataTypes.STRING,
      offers: DataTypes.STRING,
      domainKnowlegde: DataTypes.STRING,
      bookingUrl: DataTypes.STRING,
      facebookUrl: DataTypes.STRING,
      linkedinUrl: DataTypes.STRING,
      githubUrl: DataTypes.STRING,
      avatarUrl: DataTypes.STRING,
      schools: DataTypes.ARRAY(DataTypes.STRING),
      exp: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "Mentor",
    }
  );
  return Mentor;
};
