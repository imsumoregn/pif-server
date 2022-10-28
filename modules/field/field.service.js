const {Field} = require("../../models/index");

const getAllFields = async (req, res) => {

    const fields = await Field.findAll();

    return res.status(200).json({
        isError: false,
        data: fields,
        message: 'Get all fields successfully.',
    });

};

module.exports = {getAllFields};