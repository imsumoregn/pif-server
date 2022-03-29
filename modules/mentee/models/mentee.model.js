const { sequelize, Sequelize } = require("../../../setup/database");

const Mentee = sequelize.define(
  "Mentee",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING(50),
      unique: true,
    },
    password: {
      type: Sequelize.STRING(128),
    },
    name: {
      type: Sequelize.STRING(40),
    },
    memberSince: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    dob: {
      type: Sequelize.DATE,
    },
    isConfirmedEmail: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    avatarUrl: {
      type: Sequelize.STRING,
    },
    schools: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    exp: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);
