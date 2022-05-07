const { Scope } = require("../../models/index");

const getAllScopes = async () => {
    const scopes = await Scope.findAll();
    return res.status(200).json({
        isError: false,
        data: scopes,
        message: "Get all scopes successfully.",
    });
}

module.exports = { getAllScopes };