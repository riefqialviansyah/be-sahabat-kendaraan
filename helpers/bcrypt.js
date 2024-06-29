const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const encryptPass = (password) => {
  return bcrypt.hashSync(password, salt);
};

const checkPass = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = { encryptPass, checkPass };
