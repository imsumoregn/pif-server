"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Mentees",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
        },
        name: {
          type: Sequelize.STRING,
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
          type: Sequelize.ARRAY(Sequelize.STRING),
        },
        exp: {
          type: Sequelize.ARRAY(Sequelize.STRING),
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Mentees");
  },
};
