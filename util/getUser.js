const mongoose = require("mongoose");

module.exports = (id) => {
  const User = mongoose.models.User;
  return User.findOne({_id: id})
};
