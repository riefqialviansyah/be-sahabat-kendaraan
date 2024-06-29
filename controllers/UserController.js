const { User } = require("../models");
const { checkPass } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const newUser = await User.create({ username, email, password });

      res.status(201).json({
        message: "Success create user",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { name: "Unauthorized", message: "Incorrect email or password" };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw { name: "Unauthorized", message: "Incorrect email or password" };
      }

      const isPasswordCorrect = checkPass(password, user.password);
      if (!isPasswordCorrect) {
        throw { name: "Unauthorized", message: "Incorrect email or password" };
      }
      const token = generateToken({ id: user.id });
      delete req.body.password;

      res.status(200).json({
        message: "Success login",
        data: {
          email: user.email,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
