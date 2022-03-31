"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Mentors",
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
        name: {
          type: Sequelize.STRING,
        },
        memberSince: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        hobbies: {
          type: Sequelize.STRING,
        },
        offers: {
          type: Sequelize.STRING,
        },
        domainKnowlegde: {
          type: Sequelize.STRING,
        },
        bookingUrl: {
          type: Sequelize.STRING,
        },
        facebookUrl: {
          type: Sequelize.STRING,
        },
        linkedinUrl: {
          type: Sequelize.STRING,
        },
        githubUrl: {
          type: Sequelize.STRING,
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
    await queryInterface.dropTable("Mentors");
  },
};
