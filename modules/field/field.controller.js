const { Field } = require("../../models/index");

const getAllFields = async (req, res) => {
  const fields = await Field.findAll();
  return res.status(200).json({
    isError: false,
    data: fields,
    message: "Get all fields successfully.",
  });
};

const addFields = async (req, res) => {
  const fields = req.body.data.map((field) => {
    return { name: field, isDefined: true };
  });
  const created = await Field.bulkCreate(fields);
  return res.status(200).json({
    isError: false,
    data: created,
    message: "Add fields successfully.",
  });
};

module.exports = { getAllFields, addFields };
