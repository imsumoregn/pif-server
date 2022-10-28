const _ = require("lodash");
const {Op} = require("sequelize");

const {User, Offer, Mentor, Field, Review} = require("../../models/index");
const {
    DEFAULT_PAGE,
    DEFAULT_NUMBER_OF_ITEMS,
} = require("../shared/shared.constant");
const {FIELDS} = require("../field/field.constant");
const {MENTOR} = require("../user/user.constant");
const {OFFERS} = require("../offer/offer.constant");

const filterMentor = async (req, res) => {

    let fields = req.body.fields || [];
    let offers = req.body.offers || [];
    const page = req.body.page || DEFAULT_PAGE;
    const itemsPerPage = req.body.itemsPerPage || DEFAULT_NUMBER_OF_ITEMS;
    let profiles;

    if (!offers?.length && !fields?.length) {

        profiles = await Mentor.findAndCountAll({
            offset: (page - 1) * itemsPerPage,
            limit: itemsPerPage,
        });

    } else {

        if (fields.length && fields.includes(FIELDS.OTHERS)) {

            const otherFields = await Field.findAll({where: {isDefined: false}});
            fields = _.concat(
                fields,
                otherFields?.map((field) => field.key)
            );
            _.remove(fields, (field) => field === FIELDS.OTHERS);

        }

        if (offers.length && offers.includes(OFFERS.OTHERS)) {

            const otherOffers = await Offer.findAll({where: {isDefined: false}});
            offers = _.concat(
                offers,
                otherOffers?.map((offer) => offer.key)
            );
            _.remove(offers, (offer) => offer === OFFERS.OTHERS);

        }

        offers = offers.map((offer) => {
            return {offers: {[Op.contains]: [offer]}};
        });
        fields = fields.map((field) => {
            return {fields: {[Op.contains]: [field]}};
        });

        if (fields.length && !offers.length) {

            profiles = await Mentor.findAndCountAll({
                where: {
                    [Op.or]: fields,
                },
                offset: (page - 1) * itemsPerPage,
                limit: itemsPerPage,
            });

        } else if (!fields.length && offers.length) {

            profiles = await Mentor.findAndCountAll({
                where: {
                    [Op.or]: offers,
                },
                offset: (page - 1) * itemsPerPage,
                limit: itemsPerPage,
            });

        } else {

            profiles = await Mentor.findAndCountAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: fields,
                        },
                        {
                            [Op.or]: offers,
                        },
                    ],
                },
                offset: (page - 1) * itemsPerPage,
                limit: itemsPerPage,
            });

        }

    }

    const users = await Promise.all(
        profiles?.rows.map(async (mentor) => {
            return await User.findByPk(mentor.userId)
        })
    );

    const userProfiles = users.map((user, index) => (_.omit(Object.assign(user.dataValues, profiles.rows[index].dataValues), ["password"])))

    return res.status(200).json({
        isError: false,
        data: userProfiles,
        message: "Get mentors successfully.",
        total: profiles?.count || 0,
    });

};

const getAllReviewsByMentorId = async (req, res) => {

    const mentor = await User.findOne({
        where: {id: req.params.id, role: MENTOR},
    });

    if (!mentor) {

        const error = new Error('Mentor not found!');
        error.status = 404;
        throw error

    }

    const {rows, count} = await Review.findAndCountAll({
        where: {mentorId: req.params.id},
    });

    return res.status(200).json({
        isError: false,
        data: rows,
        total: count,
        message: `Get all reviews of mentor ${mentor.name} successfully.`,
    });

};

module.exports = {
    filterMentor,
    getAllReviewsByMentorId,
};
