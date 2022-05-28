const jwt = require("jsonwebtoken");
const { Token } = require("../models");
const {
  TOKEN_ACTIVE,
  TOKEN_EXPRIRED,
} = require("../modules/mentee/mentee.constant");

const authorization = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ isError: true, message: "Access denied. No token provided!" });
  }

  const storedToken = await Token.findOne({
    where: { value: token },
  });
  const now = new Date();

  if (!storedToken) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  } else if (
    storedToken.status === TOKEN_EXPRIRED ||
    storedToken.expriredDate.getTime() < now.getTime()
  ) {
    if (
      storedToken.expriredDate.getTime() < now.getTime() &&
      storedToken.status === TOKEN_ACTIVE
    ) {
      await storedToken.update({ status: TOKEN_EXPRIRED });
    }

    return res.status(401).json({ isError: true, message: "Token exprired!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(400).json({ isError: true, message: "Invalid token!" });
  }
};

module.exports = authorization;
