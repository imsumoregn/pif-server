"use strict";

const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Fields", [
      {
        id: uuid(),
        key: "design",
        name: "Design",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "marketing",
        name: "Marketing",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "product",
        name: "Product",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "software-development",
        name: "Software Development",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "data-science",
        name: "Data Science",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "finance",
        name: "Finance",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "hr",
        name: "HR",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "others",
        name: "Khác",
        isDefined: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Fields", {
      key: {
        [Op.in]: [
          "design",
          "marketing",
          "product",
          "software-development",
          "data-science",
          "finance",
          "hr",
          "others",
        ],
      },
    });
  },
};
