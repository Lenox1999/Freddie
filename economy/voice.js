const mongoose = require("mongoose");

module.exports = async (oldState, newState) => {
  const User = mongoose.models.User;

  const user = await User.findOne({ _id: newState.id });

  if (newState.channelId == null) {
    const fishPerMin = 5;

    user.leftVC = Date.now();
    let timeInVC = (user.leftVC - user.joinedVC) / 1000 / 60;
    if (timeInVC < 1) {
      // heißt der Nutzer war weniger als eine Minute im Voicechannel
      console.log(
        "Nutzer war zu kurz im Voicechannel um Belohnung zu erhalten"
      );
      user.leftVC = 0;
      user.save();
      return;
    }

    let reward = Math.round(timeInVC * fishPerMin);
    user.fishAmmount = user.fishAmmount + reward;

    console.log(
      `${user.name} hat den Voicechannel verlassen und war ${timeInVC}min im Channel`
    );
    console.log(
      `${user.name} hat ${reward} Fische durch seine Zeit im Vc bekommen`
    );
    user.joinedVC = 0;
    user.leftVC = 0;
    user.save();
    return;
  }

  /*
    wenn sich die ChannelId von oldSate zu newState nicht geändert
    heißt das der User hat den Vc nicht verlassen
    bedeutet er hat sich gemuted 
  */
  if (oldState.channelId == newState.channelId) {
    console.log("User hat sich gemuted oder so...");
  } else {
    user.joinedVC = Date.now();

    user.save();
    console.log(`${user.name} ist dem Voicechannel beigetreten!`);
  }
};
