"use strict";
const { Op } = require("sequelize");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");

const { EMPTY } = require("../modules/shared/shared.constant");
const { MENTEE, MENTOR } = require("../modules/user/user.constant");
const { Mentor, Mentee } = require("../models");
const { FIELDS } = require("../modules/field/field.constant");
const { OFFERS } = require("../modules/offer/offer.constant");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const mentorUserIds = [uuid(), uuid(), uuid(), uuid()];
    const menteeUserIds = [uuid(), uuid(), uuid()];
    const mentorIds = [uuid(), uuid(), uuid(), uuid()];
    const menteeIds = [uuid(), uuid(), uuid()];

    const salt = await bcrypt.genSalt(Number(process.env.SALT_USER_PW));
    const password = await bcrypt.hash("12345678", salt);

    const mockMenteeUsers = Array(3).fill({
      registeringMethod: 'basic',
      email: "giangpham.shecodes@gmail.com",
      password: password,
      name: "Giang Pham",
      gender: 'male',
      role: MENTEE,
      schoolName: "A school",
      major: "CS",
      title: "Software Engineer",
      workplace: "Contemi Vietnam",
      location: "Saigon",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      github: "https://github.com/shecodesvietnam",
      linkedin: "https://www.linkedin.com/company/shecodesvietnam/",
      avatarUrl: "https://i.pinimg.com/564x/fc/48/26/fc4826adafeed058bf572fc521f65732.jpg",
      isActive: true,
      hasConfirmedEmail: true,
      createdAt: now,
      updatedAt: now,
    }).map((mentee, idx) => ({ ...mentee, id: menteeUserIds[idx] }))

    const mockMentees = Array(3).fill({
      createdAt: now,
      updatedAt: now,
    }).map((mentee, idx) => ({ ...mentee, id: menteeIds[idx], userId: menteeUserIds[idx] }))

    const mockMentorUsers = Array(4).fill({
      registeringMethod: 'google',
      email: "mentorship.shecodes@gmail.com",
      password: password,
      name: "SheCodes",
      gender: "female",
      role: MENTOR,
      schoolName: "A school",
      major: "CS",
      title: "Mentor",
      workplace: "SheCodes Vietnam",
      location: "Hanoi",
      description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      github: "https://github.com/shecodesvietnam",
      linkedin: "https://www.linkedin.com/company/shecodesvietnam",
      avatarUrl: "https://i.pinimg.com/564x/b7/22/14/b722148204f74e8bd80e22a700a61b70.jpg",
      isActive: true,
      hasConfirmedEmail: true,
      createdAt: now,
      updatedAt: now,
    }).map((mentor, idx) => ({ ...mentor, id: mentorUserIds[idx] }))

    const mockMentors = Array(4).fill({
      bookingUrl: EMPTY,
      createdAt: now,
      updatedAt: now,
    }).map((mentors, idx) => ({ ...mentors, id: mentorIds[idx], userId: mentorUserIds[idx], fields: [Object.keys(FIELDS)[idx]], offers: [Object.keys(OFFERS)[idx]] }))

    const created = await queryInterface.bulkInsert("Users", [...mockMenteeUsers, ...mockMentorUsers]);

    if (created) {
      await Promise.all([
        queryInterface.bulkInsert("Mentees", [...mockMentees]),
        queryInterface.bulkInsert("Mentors", [...mockMentors]),
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
