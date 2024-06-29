const errHandler = (err, req, res, next) => {
  switch (err.name) {
    case "Unauthorized":
      res.status(401).json({ message: err.message });
      break;

    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;

    case "NotFound":
      res.status(400).json({ message: err.message });
      break;

    default:
      res.status(500).json({ message: "Internal server error" });
      console.log(err);
      console.log(err.name, "<<<<<<<<<< error name");
      break;
  }
};

module.exports = errHandler;
