"use strict";
const { Model } = require("sequelize");
const { encryptPass } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Username is require" },
          notEmpty: { msg: "Username is require" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already used",
        },
        validate: {
          notNull: { msg: "Email is require" },
          notEmpty: { msg: "Email is require" },
          isEmail: { msg: "Not valid email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is require" },
          notEmpty: { msg: "Password is require" },
          len: { args: 6, msg: "Password length atleast 6 char" },
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["user", "admin"]],
            msg: "Role must be user or admin",
          },
          notNull: { msg: "Role is require" },
          notEmpty: { msg: "Role is require" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user) {
          user.password = encryptPass(user.password);
        },
      },
    }
  );
  return User;
};
