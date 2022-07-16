"use strict";

const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Offers", [
      {
        id: uuid(),
        key: "career-orientation",
        name: "Định hướng nghề nghiệp",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "find-job",
        name: "Tìm việc",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "interview",
        name: "Phỏng vấn thử",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "review-resume",
        name: "Sửa Resume/CV",
        isDefined: true,
      },
      {
        id: uuid(),
        key: "learning-path",
        name: "Lộ trình học tập",
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
    await queryInterface.bulkDelete("Offers", {
      key: {
        [Op.in]: [
          "career-orientation",
          "find-job",
          "interview",
          "review-resume",
          "learning-path",
          "others",
        ],
      },
    });
  },
};
