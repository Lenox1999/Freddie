const { EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

const userNotRegistered = require("../util/userNotRegistered");
const createNewUser = require('../util/createNewUser');

module.exports = async (oldState, newState, client) => {
  const User = mongoose.models.User;

  const vc = newState.channelId;

  const user = await User.findOne({ _id: newState.id }, "coinAmmount gears bananaAmmount");

  if (!user) {
    await createNewUser(newState.id, client);
    // userNotRegistered(client);
    return;
  }

  let bananas = user.gears.plantation;
  let getbanana = 0;

  let amount = Math.floor(Math.random() * 100);
  if(amount <= bananas.onebanana) { 
    getbanana = 1;
   } else if(amount <= bananas.twobanana + bananas.onebanana) {
    getbanana = 2;
   } else if(amount <= bananas.threebanana + bananas.twobanana + bananas.onebanana) {
    getbanana = 3
   }

  const cooldown = user.gears.fertilizer.cooldownvc;
  // check if user isnt registered

  /*
    ++++++++USER LEFT++++++++

    if newState contains no new channelid that means that the user left all voice channels
    and is no longer active in any voice channel on the server 
  */
  if (newState.channelId == null) {
    let oldVoiceChannelId = oldState.channelId;
    // if (client.channels.cache.get(oldVoiceChannelId).members.size == 0) {
    //   return;
    // }
    user.leftVC = Date.now();
    if (user.joinedVC === 0 || user.leftVC === 0) return;
    let timeInVC = (user.leftVC - user.joinedVC) / 1000 / cooldown;
    // heißt der Nutzer war weniger als eine Minute im Voicechannel
    if (timeInVC < 1) {
      user.leftVC = 0;
      user.save();
      return;
    }

    let reward = Math.round(timeInVC * getbanana);
    user.fishAmmount = user.fishAmmount + reward;

    user.joinedVC = 0;
    user.leftVC = 0;
    user.save();

    // because one user alone cant gain any points we have to check how many people are in the vc
    // after the one user left
    // so if the old channel just contains one member the reward has to be triggered

    if (client.channels.cache.get(oldVoiceChannelId).members.size == 1) {
      client.channels.cache
        .get(oldVoiceChannelId)
        .members.each(async (data) => {
          const user = await User.findOne({ _id: data.user.id });

          // should prevent that the same user gets handled twice or dont handle a user that wasnt registered at the point of joining the channel
          if (user.joinedVC == 0 ) {
            return;
          }
          console.log(user.name)

          user.leftVC = Date.now();
          console.log(user.name);
          let timeInVC = (user.leftVC - user.joinedVC) / 1000 / cooldown;
          if (timeInVC < 1) {
            // heißt der Nutzer war weniger als eine Minute im Voicechannel
            user.joinedVC = 0;
            user.leftVC = 0;
            user.save();
            return;
          }

          let reward = Math.round(timeInVC * getbanana);
          console.log(timeInVC, 'spent time');
          console.log(reward);
          user.fishAmmount += reward;

          user.joinedVC = 0;
          user.leftVC = 0;
          user.save();
        });
    }
    return;

    /*
    +++++ USER MOVED +++++
  
    there is a newState and a oldState which means user moved
    by comparing old channel id and new channel id we can check if user only muted
  */
  } else if (
    oldState.channelId !== null &&
    newState.channelId !== null &&
    oldState.channelId !== newState.channelId
  ) {
    let oldVoiceChannelId = oldState.channelId;
    let newVoiceChannelId = newState.channelId;
    if (client.channels.cache.get(oldVoiceChannelId).members.size == 1) {
      client.channels.cache
        .get(oldVoiceChannelId)
        .members.each(async (data) => {
          const user = await User.findOne({ _id: data.user.id });

          user.leftVC = Date.now();
          let timeInVC = (user.leftVC - user.joinedVC) / 1000 / cooldown;
          if (timeInVC < 1) {
            // heißt der Nutzer war weniger als eine Minute im Voicechannel
            user.leftVC = 0;
            user.save();
            return;
          }

          let reward = Math.round(timeInVC * getbanana);
          user.fishAmmount = user.fishAmmount + reward;

          user.joinedVC = 0;
          user.leftVC = 0;
          user.save();
        });
    }

    if (client.channels.cache.get(newVoiceChannelId).members.size == 1) {
      client.channels.cache.get(newVoiceChannelId).members.each(async (data) => {
        const user = await User.findOne({ _id: data.user.id });

        user.leftVC = Date.now();
        let timeInVC = (user.leftVC - user.joinedVC) / 1000 / cooldown;
        if (timeInVC < 1) {
          // heißt der Nutzer war weniger als eine Minute im Voicechannel
          user.leftVC = 0;
          user.save();
          return;
        }

        let reward = Math.round(timeInVC * getbanana);
        user.fishAmmount = user.fishAmmount + reward;

        user.joinedVC = 0;
        user.leftVC = 0;
        user.save();
      });
    }

    if (
      client.channels.cache.get(newVoiceChannelId).members.size >= 2 &&
      client.channels.cache.get(newVoiceChannelId).members.size < 3
    ) {
      // Fall definieren, dass vorher nur ein User im VC war
      client.channels.cache.get(vc).members.each(async (data) => {
        const user = await User.findOne({ _id: data.user.id });
        user.joinedVC = Date.now();
        user.save();
      });
    } else if (client.channels.cache.get(newVoiceChannelId).members.size <= 3) {
      // Fall definieren, dass mehr als 2 User im VC sind
      user.joinedVC = Date.now();
      user.save();
    } else {
      return;
    }

    /* 
      ++++++ USER JOINED NEW CHANNEL ++++++
      if theres no oldstate channel id that means the user joined a voicechannel
    */
  } else if (oldState.channelId == null) {
    if (
      client.channels.cache.get(vc).members.size >= 2 &&
      client.channels.cache.get(vc).members.size < 3
    ) {
      // Fall definieren, dass vorher nur ein User im VC war
      client.channels.cache.get(vc).members.each(async (data) => {
        const user = await User.findOne({ _id: data.user.id });
        user.joinedVC = Date.now();
        user.save();
      });
    } else if (client.channels.cache.get(vc).members.size <= 3) {
      // Fall definieren, dass mehr als 2 User im VC sind
      user.joinedVC = Date.now();
      user.save();
    } else {
      return;
    }
  }
};
