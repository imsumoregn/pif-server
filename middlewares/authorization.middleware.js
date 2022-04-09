const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .send({ isError: true, message: "Access denied. No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (exception) {
    return res.status(400).send({ isError: true, message: "Invalid token!" });
  }
};

module.exports = authorization;
