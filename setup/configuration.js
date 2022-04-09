module.exports = () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("FATAL ERROR: JWT_SECRET_KEY is not defined.");
  }
};
