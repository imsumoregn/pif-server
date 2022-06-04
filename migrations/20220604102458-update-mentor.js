"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Mentors", "offers", {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn("Mentors", "domainKnowlegde", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Mentors", "offers", {
      type: Sequelize.ARRAY(Sequelize.STRING),
    });

    await queryInterface.changeColumn("Mentors", "domainKnowlegde", {
      type: Sequelize.ARRAY(Sequelize.STRING),
    });
  },
};
