import React, {
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Difficulty, ItemContainerProps } from "./models";
import { useArray, useToggle } from "../../hooks";
import { checkForDefeat, generateGame } from "./engine";
import { formatTime } from "../../utilities";

interface ILogicGameContext {
  inGame: boolean;
  newGame: () => void;
  startGame: (difficulty: Difficulty) => void;
  endGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  won: boolean;
  gameOver: boolean;
  generatePuzzle: () => void;
  containersRemaining: number;
  containers: ItemContainerProps[];
  selectContainer: (container: ItemContainerProps) => void;
  selectedContainer: ItemContainerProps | null;
  containerLimit: number;
  addContainer: () => void;
  gameTime?: string;
}

export const LogicGameContext = createContext<ILogicGameContext>({
  inGame: false,
  newGame: () => {},
  startGame: () => {},
  endGame: () => {},
  setDifficulty: () => {},
  won: false,
  gameOver: false,
  generatePuzzle: () => {},
  containersRemaining: 0,
  containers: [],
  containerLimit: 0,
  selectContainer: () => {},
  selectedContainer: null,
  addContainer: () => {},
  gameTime: "",
});

export function useLogicGameContext(): ILogicGameContext {
  const value = useContext(LogicGameContext);
  if (value === null) {
    throw new Error(
      "useLogicGameContext must be used within a LogicGameProvider"
    );
  }
  return value;
}

export const LogicGameContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [inGame, setInGame] = useToggle(false);
  const [won, setWon] = useToggle(false);
  const [gameOver, setGameOver] = useToggle(false);
  const [containersRemaining, setContainersRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [containerLimit, setContainerLimit] = useState<number>(0);
  const [selectedContainer, setSelectedContainer] =
    useState<ItemContainerProps | null>(null);
  const [gameTime, setGameTime] = useState<string>();
  const {
    array: containers,
    set: setContainers,
    update: updateContainer,
    push: pushContainer,
  } = useArray<ItemContainerProps>([]);

  const generatePuzzle = () => {
    const {
      containers: newContainers,
      additionalContainers,
      containerLimit: newContainerLimit,
    } = generateGame({
      difficulty,
    });
    setContainers(newContainers);
    setContainersRemaining(additionalContainers);
    setContainerLimit(newContainerLimit);
  };

  const selectContainer = useCallback(
    (newContainer: ItemContainerProps) => {
      if (!selectedContainer) {
        if (newContainer.items.length === 0) {
          // This one is empty, so we can't select it
          return;
        }
        // Haven't selected a container yet, so select this one
        setSelectedContainer(newContainer);
        return;
      }

      // If the selected container is the same as the new container, deselect it
      if (selectedContainer.indx === newContainer.indx) {
        setSelectedContainer(null);
        return;
      }

      // If the selected container is full, we can't move to it
      if (newContainer.items.length === containerLimit) {
        setSelectedContainer(newContainer);
        return;
      }

      // Method to move an item from the selected container to the new container
      const moveItem = () => {
        // Grab the last item from the selected container
        const tempItem = selectedContainer.items.pop();
        // If there is no item, we can't move
        if (tempItem) {
          // Add the item to the new container
          updateContainer(newContainer.indx, {
            ...newContainer,
            items: [...newContainer.items, tempItem],
          });
          // Remove the item from the selected (previous) container
          updateContainer(selectedContainer.indx, {
            ...selectedContainer,
            items: selectedContainer.items,
          });
        }
        setSelectedContainer(null);
      };

      // If the new container is empty, we can move
      if (newContainer.items.length === 0) {
        moveItem();
        return;
      }

      // Object trying to move
      const selectedItem =
        selectedContainer.items[selectedContainer.items.length - 1];
      // Object being moved to
      const targetItem = newContainer.items[newContainer.items.length - 1];
      // If the new container doesn't have the same item, we can't move
      if (selectedItem === targetItem) {
        moveItem();
        return;
      }

      // Finally, we just select the new container if we can't move
      setSelectedContainer(newContainer);
    },
    [selectedContainer, updateContainer]
  );

  useEffect(() => {
    // If all containers holding items are full, and they are all the same, you win
    if (
      containers.every((container) => {
        if (container.items.length === 0) {
          return true;
        }

        return (
          container.items.length === containerLimit &&
          container.items.every((item) => item === container.items[0])
        );
      })
    ) {
      setWon(true);
      setGameOver(true);
    }

    // Check if there are no more valid moves
    if (containersRemaining > 0) {
      return;
    }

    if (checkForDefeat(containers, containerLimit)) {
      setGameOver(true);
    }
  }, [containers, containerLimit]);

  useEffect(() => {
    if (!gameOver) {
      return;
    }
    if (!startTime) {
      return;
    }
    const endTime = new Date();
    const timeDiff = endTime.getTime() - startTime.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    setGameTime(formatTime(seconds));
  }, [gameOver]);

  const newGame = () => {
    setInGame(true);
    setWon(false);
    setGameOver(false);
    generatePuzzle();
    setStartTime(new Date());
  };

  const startGame = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    setInGame(true);
  };

  const endGame = () => {
    setInGame(false);
    setWon(false);
    setGameOver(false);
  };

  const addContainer = () => {
    if (containersRemaining === 0) {
      return;
    }
    setContainersRemaining((c) => c - 1);
    pushContainer({
      indx: containers.length,
      items: [],
    });
  };

  const value = useMemo(
    () => ({
      inGame,
      newGame,
      startGame,
      endGame,
      setDifficulty,
      won,
      gameOver,
      generatePuzzle,
      containersRemaining,
      containers,
      containerLimit,
      selectContainer,
      selectedContainer,
      addContainer,
      gameTime,
    }),
    [
      inGame,
      newGame,
      startGame,
      endGame,
      setDifficulty,
      won,
      gameOver,
      generatePuzzle,
      containersRemaining,
      containers,
      containerLimit,
      selectContainer,
      selectedContainer,
      addContainer,
      gameTime,
    ]
  );

  return (
    <LogicGameContext.Provider value={value}>
      {children}
    </LogicGameContext.Provider>
  );
};
