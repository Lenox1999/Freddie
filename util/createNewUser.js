const mongoose = require("mongoose");

module.exports = async (id, client) => {
  const User = mongoose.models.User;
  const allreadyUser = await User.findOne({ _id: id });
  if (allreadyUser) return;
  const user = await client.users.fetch(id);

  const newUser = new User(
    {
      _id: id,
      name: user.username,
      coinAmmount: 0,
      bananaAmmount: 1,
      streak: 0,
      lastLogin: Date.now(),
      dailyLastTriggered: 0,
      gears: {
        plantation: { level: 1, onebanana: 95, twobanana: 4, threebanana: 1 }, //max Level 9, onebanana: 50(5), twobanana: 40(4), threebanana: 10(1)
        fertilizer: { level: 1, cooldownmsg: 30, cooldownvc: 60 }, //max Level: 10, cooldownmsg: 20, cooldownvc: 50
        moremonkeys: { level: 1, time: 4 }, //max Level: 6, time: 1(0.5)
      },
      lastMessage: Date.now(),
      joinedVC: 0,
      leftVC: 0,
      items: [],
      multiplier: { value: 1, last: 0 },
      XP: 3,
      lvl: 0,
      lastMonkeys: 0,
      inventory: { lootboxes: [] },
    },
    { strict: false }
  );
  newUser.save();
  return newUser;
};
