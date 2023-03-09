const { FIELDS } = require("./field.constant");

const getAllFields = async (_, res) => {

    const fields = Object.keys(FIELDS)

    return res.status(200).json({
        isError: false,
        data: fields,
        message: 'Get all fields successfully.',
    });

};

module.exports = {getAllFields};
