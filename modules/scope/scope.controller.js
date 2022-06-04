const { Scope } = require("../../models/index");

const getAllScopes = async () => {
  const scopes = await Scope.findAll();
  return res.status(200).json({
    isError: false,
    data: scopes,
    message: "Get all scopes successfully.",
  });
};

const addScopes = async (req, res) => {
  const scopes = req.body.data.map((scope) => {
    return { name: scope, isDefined: true };
  });
  const created = await Scope.bulkCreate(scopes);
  return res.status(200).json({
    isError: false,
    data: created,
    message: "Add scopes successfully.",
  });
};

module.exports = { getAllScopes };
