const {
  SlashCommandBuilder,
  EmbedBuilder,
  AllowedMentionsTypes,
} = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inv")
    .setDescription("See whats in your inventory"),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne(
      { _id: interaction.member.id },
      "inventory"
    );

    // go through every element which is save in inventory
    // sort between classes and lootboxes

    // find lootboxes in inventory

    const lootboxes = user.inventory.lootboxes;

    const listOfRarities = [];
    const alreadyListedRarities = [];

    // at first we go through the lootboxes... its the same code as in open
    // the loop takes an lootbox and its rarity and then passes this on to the second, nested loop, which looks for other lootboxes of the same rarity and counts them
    // after that this rarity gets pushed to alreadyListedRarities array and the loop first loop should jump to the next lootbox if it hits an already listed rarity
    // in this fashion we go through every lootbox in the users inventory

    for (let i = 0; i <= lootboxes.length - 1; i++) {
      let currRarity = lootboxes[i].rarity;
      if (alreadyListedRarities.includes(currRarity.toUpperCase())) {
        continue;
      }
      let rarityCount = 1;
      for (let k = i + 1; k <= lootboxes.length - 1; k++) {
        if (lootboxes[k].rarity === currRarity) {
          rarityCount += 1;
        } else {
          continue;
        }
      }
      currRarity = currRarity.toUpperCase();
      alreadyListedRarities.push(currRarity);
      listOfRarities.push(`${rarityCount}x ${currRarity}`);
    }

    const rarityString = listOfRarities.join("\n");

    let classObj = {};

    const items = user.inventory.contents;

    // we create an classobj which has an own property for every class of items in the users inventory
    /* 
      it should look like that
      
      classObj = {
        weapons: [weapon1, weapon2, ...],
        utilities: [util1, util2, ...],
        ...
      }
    */

    for (let i = 0; i <= items.length - 1; i++) {
      let currItem = items[i];
      let currClass = currItem.class;

      if (!classObj[currClass]) {
        classObj[currClass] = [currItem];
      } else if (classObj[currClass]) {
        classObj[currClass].push(currItem);
      }
    }

    let finalString = [];

    let alreadyItems = [];

    // now it gets more confusing
    // the first loop is responsible for going through every key, value pair in the object. The Key is the name of the Item class and the value is the array 
    // the second loop then sets in and loops through every item in the array of the according weapon class
    // then the name of the first item gets taken and passed on to the third, nested loop, which then counts every item, that has the same name
    // after counting, the name of the item gets passed onto an array
    // the second loop which contains every item of an weapon class has an check so we dont list an item more than one time
    // after all items are counted it gets passed on to the item classes own string array which is defined as for example classObj.weaponsString
    // this array contains every item with the number of times its in the users inventory
    // once we are through every item of an class, the string gets put together and pushed into an another array, which will contain the name of every item class, and the count of each item in this class
    // once we are through every itemclass this final string gets put together, which is the finished presentation of an users inventory

    for (const [key, value] of Object.entries(classObj)) {
      // saving itemclass name in a extra array as a string
      classObj[`${key}String`] = [`**${key.toUpperCase()}** \n`];
      
      // looping through every item of a class
      for (let i = 0; i <= classObj[key].length - 1; i++) {
        // defening the element at the loops position
        let e = classObj[key][i];
        // setting itemcount to 1, bc item already occured once
        let itemCount = 1;

        // checking if item has already been counted, if it has indexOf should return an valid index in the alreadyItems array, if not it return -1
        if (alreadyItems.indexOf(e.name) !== -1) {
          continue;
        }

        // the next loop loops through all the other elements in the itemsclass to count the ammount of each item
        for (let k = i + 1; k <= classObj[key].length - 1; k++) {
          
          // if the item is for some reason not a valid item, it should disregard it
          if (!classObj[key][k]) {
            continue;
          }
          
          // if another item matches the name of the initial item we increase the itemcount for this item
          if (classObj[key][k].name === e.name) {
            itemCount += 1;
            // push it into already items
            alreadyItems.push(e.name);
          }
        }
        // push it in alreadyItems so it doesnt get counted or listed more than once
        alreadyItems.push(e.name);
        // push "itemcount x itemname" into the class array
        classObj[`${key}String`].push(`${itemCount}x ${e.name}\n`);
      }
      // after counting every item of a class we push each itemname with its ammount into the finalstring
      finalString.push(classObj[`${key}String`].join(""));
    }

    // check if user has lootboxes and if yes push it into the final array
    if (listOfRarities.length > 0) {
      finalString.push(`**Lootboxen**`, rarityString);
    }

    // create an embed which puts every element of the finalarray together and then puts out the users inventory
    var invEmbed = new EmbedBuilder().setTitle("`Dein Inventar`").setAuthor({
      name: `${interaction.member.displayName}`,
      iconURL: interaction.member.displayAvatarURL(),
    }).setDescription(`

        ${finalString.join(`\n`)}
        `);

    interaction.reply({ embeds: [invEmbed] });
    return;
  },
};
