const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) next();
  else
    return res.status(500).json({
      message: "Internal Error!",
    });
};

module.exports = haltOnTimedout;
