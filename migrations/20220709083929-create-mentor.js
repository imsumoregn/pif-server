"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Mentors", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      location: {
        type: Sequelize.STRING,
      },
      linkedin: {
        type: Sequelize.STRING,
      },
      bookingUrl: {
        type: Sequelize.STRING,
      },
      github: {
        type: Sequelize.STRING,
      },
      scopes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      fields: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      offers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      userId: {
        type: Sequelize.UUID,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Mentors");
  },
};
