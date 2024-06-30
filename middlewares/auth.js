const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw { name: "Unauthorized", message: "Token is required" };
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      throw { name: "Unauthorized", message: "Invalid token type" };
    }

    if (!token) {
      throw { name: "Unauthorized", message: "Token is required" };
    }

    const decrypted = verifyToken(token);

    const userReq = await User.findByPk(decrypted.id);

    req.user = userReq;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
