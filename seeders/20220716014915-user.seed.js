"use strict";
const { Op } = require("sequelize");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");

const { EMPTY } = require("../modules/shared/shared.constant");
const { MENTEE, MENTOR } = require("../modules/user/user.constant");
const { Mentor, Mentee } = require("../models");

const [menteeId, mentorId] = [uuid(), uuid()];

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const salt = await bcrypt.genSalt(Number(process.env.SALT_USER_PW));
    const password = await bcrypt.hash("12345678", salt);

    const created = await queryInterface.bulkInsert("Users", [
      {
        id: menteeId,
        email: "giangpham.shecodes@gmail.com",
        password: password,
        method: EMPTY,
        name: "Giang Pham",
        phone: "0123456789",
        school: "FPT University",
        exp: JSON.stringify({
          job: "Software Engineer",
          workspace: "Contemi Vietnam",
        }),
        birthday: new Date(2000, 1, 1),
        role: MENTEE,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        memberSince: now,
        isActive: true,
        isConfirmed: true,
        avatar:
          "https://i.pinimg.com/564x/fc/48/26/fc4826adafeed058bf572fc521f65732.jpg",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: mentorId,
        email: "mentorship.shecodes@gmail.com",
        password: password,
        method: EMPTY,
        name: "SheCodes",
        phone: "0123456789",
        school: "SheCodes University",
        exp: JSON.stringify({
          job: "Mentor",
          workspace: "SheCodes Vietnam",
        }),
        birthday: new Date(1998, 1, 1),
        role: MENTOR,
        description:
          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
        memberSince: now,
        isActive: true,
        isConfirmed: true,
        avatar:
          "https://i.pinimg.com/564x/b7/22/14/b722148204f74e8bd80e22a700a61b70.jpg",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    if (created) {
      await Promise.all([
        queryInterface.bulkInsert("Mentees", [
          {
            id: uuid(),
            userId: menteeId,
            createdAt: now,
            updatedAt: now,
          },
        ]),
        queryInterface.bulkInsert("Mentors", [
          {
            id: uuid(),
            userId: mentorId,
            location: "Vietnam",
            linkedin: "https://www.linkedin.com/company/shecodesvietnam/",
            bookingUrl: EMPTY,
            github: "https://github.com/shecodesvietnam",
            scopes: ["Software Development"],
            fields: ["IT"],
            offers: ["Định hướng nghề nghiệp"],
            createdAt: now,
            updatedAt: now,
          },
        ]),
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      Mentor.destroy({ truncate: true }),
      Mentee.destroy({ truncate: true }),
      queryInterface.bulkDelete("Users", {
        email: {
          [Op.in]: [
            "giangpham.shecodes@gmail.com",
            "mentorship.shecodes@gmail.com",
          ],
        },
      }),
    ]);
  },
};
