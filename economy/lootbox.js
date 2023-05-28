const itemsDB = require("./items.json");

let iterationCounts = 0;
let timeStamp1 = 0;
let timeStamp2 = 0;

module.exports = (boxRarity, givenLootbox) => {
  return new Promise((resolve) => {
    const respinItem = (rarity, itemCount, itemIndex) => {
      const numOfRespins = 10;
      let factor = 1;

      if (rarities[rarity].value === 2) {
        factor = 0.2;
      } else if (rarities[rarity] === 1) {
        factor = 0.25;
      }

      const numOfNeededRespins = Math.floor(
        rarities[rarity].outOfRespins * factor
      );

      let respinNumbers = [];

      for (let i = 0; i <= numOfRespins; i++) {
        let currIdx = Math.floor(Math.random() * (itemCount - 0 + 1) + 0);
        respinNumbers.push(currIdx);
      }
      let count = 0;

      respinNumbers.forEach((e) => {
        if (e === itemIndex) {
          count++;
        }
      });

      if (count >= numOfNeededRespins) {
        return true;
      } else {
        return false;
      }
    };
    let itemCount = 5;
    let items = [];
    let newLootbox = [];

    // count iteration for performance purposes:
    if (iterationCounts === 0) {
      timeStamp1 = Date.now();
    }

    iterationCounts += 1;

    if (givenLootbox) {
      itemCount -= givenLootbox.length;
      newLootbox = [...givenLootbox];
    }

    for (let [key, value] of Object.entries(itemsDB)) {
      let newObj = itemsDB[key];
      newObj.name = key;
      items.push(itemsDB[key]);
    }

    let boxRarityVal = rarities[boxRarity].value;

    do {
      for (let i = 0; i < itemCount; i++) {
        let currIdx = Math.floor(
          Math.random() * (items.length - 1 - 0 + 1) + 0
        );
        let currItem = items[currIdx];

        // if (currItem.hasOwnProperty()) {
        //   console.log(currItem.name);
        // }

        let currItemRarityVal = rarities[currItem.rarity].value;

        if (currItemRarityVal > boxRarityVal) {
          const boxCanContainItem = respinItem(
            currItem.rarity,
            items.length,
            items.indexOf(currItem)
          );

          if (boxCanContainItem) {
            if (newLootbox.indexOf(currItem) === -1) {
              newLootbox.push(currItem);
            } else {
              continue;
            }
          } else {
            continue;
          }
        }

        if (newLootbox.indexOf(currItem) === -1) {
          newLootbox.push(currItem);
        } else {
          continue;
        }
      }
    } while (newLootbox.length < 5);
    timeStamp2 = Date.now();
    resolve({
      rarity: boxRarity,
      contents: newLootbox,
      timestamp: Date.now(),
    });

    // createNewLootbox(boxRarity, givenLootbox);
  });
};

let rarities = {
  default: { value: 0, outOfRespins: 2 },
  rare: { value: 1, outOfRespins: 5 },
  epic: { value: 2, outOfRespins: 7 },
  mystical: { value: 3, outOfRespins: 8 },
};
