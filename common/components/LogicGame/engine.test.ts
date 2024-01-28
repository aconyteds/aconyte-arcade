import { checkForDefeat, generateGame } from "./engine";
import {
  DIFFICULTY_CONFIGURATIONS,
  Difficulty,
  ItemContainerProps,
  ItemType,
} from "./models";

describe("LogicGame -> Engine", () => {
  it.each([[Difficulty.Easy], [Difficulty.Medium], [Difficulty.Hard]])(
    "should generate a valid game for difficulty %s",
    (difficulty: Difficulty) => {
      const game = generateGame({ difficulty });
      const {
        additionalContainers,
        containerLimit,
        containers,
        uniqueItemTypeCount,
      } =
        DIFFICULTY_CONFIGURATIONS[
          difficulty === "easy"
            ? Difficulty.Easy
            : difficulty === "medium"
            ? Difficulty.Medium
            : Difficulty.Hard
        ];
      // Check if the game has the correct properties
      expect(game).toHaveProperty("containers");
      expect(game).toHaveProperty("additionalContainers");
      expect(game).toHaveProperty("containerLimit");
      expect(game).toHaveProperty("uniqueItemTypeCount");

      // Check if the game has the correct values
      expect(game.additionalContainers).toBe(additionalContainers);
      expect(game.containerLimit).toBe(containerLimit);
      expect(game.uniqueItemTypeCount).toBe(uniqueItemTypeCount);
      expect(game.containers.length).toBe(containers);

      let totalItems = 0;
      let uniqueItems = new Set<ItemType>();
      game.containers.forEach((container) => {
        expect(container.items.length).toBeLessThanOrEqual(containerLimit);
        totalItems += container.items.length;
        container.items.forEach((item) => uniqueItems.add(item));
      });

      expect(totalItems).toBe(containerLimit * uniqueItemTypeCount);
      expect(uniqueItems.size).toBe(uniqueItemTypeCount);
    }
  );

  it.each([
    [
      true,
      [
        {
          indx: 0,
          items: ["otter"],
        },
        {
          indx: 1,
          items: ["fish"],
        },
      ] as ItemContainerProps[],
      1,
    ],
    [
      false,
      [
        {
          indx: 0,
          items: ["otter"],
        },
        {
          indx: 1,
          items: ["otter"],
        },
      ] as ItemContainerProps[],
      2,
    ],
    [
      false,
      [
        {
          indx: 0,
          items: [],
        },
        {
          indx: 1,
          items: ["otter"],
        },
      ] as ItemContainerProps[],
      2,
    ],
    [
      false,
      [
        {
          indx: 0,
          items: ["otter"],
        },
        {
          indx: 1,
          items: ["atom", "otter"],
        },
      ] as ItemContainerProps[],
      2,
    ],
    [
      true,
      [
        {
          indx: 0,
          items: ["otter"],
        },
        {
          indx: 1,
          items: ["fish", "dragon"],
        },
        {
          indx: 2,
          items: ["radiation"],
        },
      ] as ItemContainerProps[],
      2,
    ],
    [
      true,
      [
        {
          indx: 0,
          items: ["otter"],
        },
        {
          indx: 1,
          items: ["otter"],
        },
        {
          indx: 2,
          items: ["otter"],
        },
        {
          indx: 3,
          items: ["otter"],
        },
      ] as ItemContainerProps[],
      1,
    ],
  ])(
    "checkForDefeat should return %s based on the provided game input",
    (
      expectedValue: boolean,
      game: ItemContainerProps[],
      containerLimit: number
    ) => {
      const result = checkForDefeat(game, containerLimit);
      expect(result).toBe(expectedValue);
    }
  );
});
