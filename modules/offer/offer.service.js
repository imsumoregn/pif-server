const {Offer} = require("../../models/index");

const getAllOffers = async (req, res) => {

    const offers = await Offer.findAll();

    return res.status(200).json({
        isError: false,
        data: offers,
        message: 'Get all offers successfully.',
    });

};

module.exports = {getAllOffers};
