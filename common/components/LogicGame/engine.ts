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
  containerLimit: number;
  uniqueItemTypeCount: number;
};

const availableIcons = [...ITEM_ICONS.keys()];

export const generateGame = ({
  difficulty,
}: GenerateGameParams): GenerateGameResult => {
  const {
    containers,
    containerLimit,
    uniqueItemTypeCount,
    additionalContainers,
  } = DIFFICULTY_CONFIGURATIONS[difficulty];

  // generate a number of random numbers equal to uniqueItemTypeCount, the limit is the size of the ITEM_ICONS object
  const randomIconIndex: number[] = [];
  while (randomIconIndex.length < uniqueItemTypeCount) {
    const randomNumber = Math.floor(Math.random() * availableIcons.length);
    if (randomIconIndex.includes(randomNumber)) {
      continue;
    }
    randomIconIndex.push(randomNumber);
  }
  // These are the icons we will use for the game
  const icons: ItemType[] = randomIconIndex.map(
    (number) => availableIcons[number] as ItemType,
  );

  // We need a number if items equal to containerLimit * icons.length
  const items: ItemType[] = [];
  for (let i = 0; i < uniqueItemTypeCount; i++) {
    for (let j = 0; j < containerLimit; j++) {
      items.push(icons[i]);
    }
  }

  // Randomize the items
  items.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);

  const fillContainers = () => {
    // We need to create a number of containers equal to containers
    const tempContainerList: ItemContainerProps[] = Array.from(
      { length: containers },
      (_, indx) => ({
        indx,
        items: [],
      }),
    );
    // Now we need to put the items in the containers, randomly
    const assignRandomItemsToContainers = (item: ItemType) => {
      let success = false;
      while (!success) {
        // Get a random number between 0 and containers
        const randomNumber = Math.floor(Math.random() * containers);
        if (tempContainerList[randomNumber].items.length === containerLimit) {
          continue;
        }
        tempContainerList[randomNumber].items.push(item);
        success = true;
      }
    };
    // Lets randomly put the item in the containers
    [...items].forEach(assignRandomItemsToContainers);
    return tempContainerList;
  };

  let valid = false;
  let escape = 0;
  let containersArray: ItemContainerProps[] = fillContainers();
  while (!valid && escape < 10000) {
    escape++;
    containersArray = fillContainers();
    // Check if the game is valid
    valid = !checkForDefeat(containersArray, containerLimit);
  }

  if (escape >= 10000) {
    throw new Error("Unable to generate a valid game");
  }

  // Return the containers and additionalContainers
  return {
    containers: containersArray,
    additionalContainers,
    containerLimit,
    uniqueItemTypeCount,
  };
};

/**
 * Method to check if the list of containers is in a state of defeat.
 *
 * @param containerList list of containers to check
 * @param containerLimit the number of items allowed in a container
 * @returns `true` if there are no more moves left
 */
export const checkForDefeat = (
  containerList: ItemContainerProps[],
  containerLimit: number,
): boolean => {
  return containerList.every((container) => {
    if (container.items.length === 0) {
      // This container is empty, something can move here
      return false;
    }

    // Check if there is a container with the same item on top
    const targetContainer = containerList.find(
      (c) =>
        c.indx !== container.indx &&
        c.items.length > 0 &&
        c.items.length < containerLimit &&
        c.items[c.items.length - 1] ===
          container.items[container.items.length - 1],
    );

    // If there is a container with the same item on top, you can move
    if (targetContainer) {
      return false;
    }

    // If there is no container with the same item on top, you can't move
    return true;
  });
};
