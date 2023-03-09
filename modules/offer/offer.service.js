const { OFFERS } = require("./offer.constant");

const getAllOffers = async (_, res) => {

    const offers = Object.keys(OFFERS)

    return res.status(200).json({
        isError: false,
        data: offers,
        message: 'Get all offers successfully.',
    });

};

module.exports = {getAllOffers};
