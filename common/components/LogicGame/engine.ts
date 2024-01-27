import {
  DIFFICULTY_CONFIGURATIONS,
  Difficulty,
  ITEM_ICONS,
  ItemContainerProps,
  ItemType,
} from "./models";

export type GenerateGameParams = {
  difficulty: Difficulty;
};

export type GenerateGameResult = {
  containers: ItemContainerProps[];
  additionalContainers: number;
  itemCount: number;
  uniqueItemCount: number;
};

const availableIcons = [...ITEM_ICONS.keys()];

export const generateGame = ({
  difficulty,
}: GenerateGameParams): GenerateGameResult => {
  const {
    containers,
    itemCount,
    uniqueItemTypeCount: uniqueItemCount,
    additionalContainers,
  } = DIFFICULTY_CONFIGURATIONS[difficulty];

  // generate a number of random numbers equal to uniqueItemCount, the limit is the size of the ITEM_ICONS object
  const randomIconIndex: number[] = [];
  while (randomIconIndex.length < uniqueItemCount) {
    const randomNumber = Math.floor(Math.random() * availableIcons.length);
    if (randomIconIndex.includes(randomNumber)) {
      continue;
    }
    randomIconIndex.push(randomNumber);
  }
  // These are the icons we will use for the game
  const icons: ItemType[] = randomIconIndex.map(
    (number) => availableIcons[number] as ItemType
  );

  // We need a number if items equal to itemCount * icons.length
  const items: ItemType[] = [];
  for (let i = 0; i < uniqueItemCount; i++) {
    for (let j = 0; j < itemCount; j++) {
      items.push(icons[i]);
    }
  }

  // Randomize the items
  items.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);

  // We need to create a number of containers equal to containers
  const containersArray: ItemContainerProps[] = Array.from(
    { length: containers },
    (_, indx) => ({
      indx,
      items: [],
    })
  );
  // Now we need to put the items in the containers, randomly
  const assignRandomItemsToContainers = (item: ItemType) => {
    let success = false;
    while (!success) {
      // Get a random number between 0 and containers
      const randomNumber = Math.floor(Math.random() * containers);
      if (containersArray[randomNumber].items.length === itemCount) {
        continue;
      }
      containersArray[randomNumber].items.push(item);
      success = true;
    }
  };
  // Lets randomly put the item in the containers
  items.forEach(assignRandomItemsToContainers);

  // Return the containers and additionalContainers
  return {
    containers: containersArray,
    additionalContainers,
    itemCount,
    uniqueItemCount,
  };
};
