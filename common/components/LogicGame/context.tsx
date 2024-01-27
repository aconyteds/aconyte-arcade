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
import { generateGame } from "./engine";

interface ILogicGameContext {
  inGame: boolean;
  newGame: () => void;
  endGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  won: boolean;
  gameOver: boolean;
  generatePuzzle: () => void;
  containersRemaining: number;
  containers: ItemContainerProps[];
  selectContainer: (container: ItemContainerProps) => void;
  selectedContainer: ItemContainerProps | null;
  itemCount: number;
  addContainer: () => void;
}

export const LogicGameContext = createContext<ILogicGameContext>({
  inGame: false,
  newGame: () => {},
  endGame: () => {},
  setDifficulty: () => {},
  won: false,
  gameOver: false,
  generatePuzzle: () => {},
  containersRemaining: 0,
  containers: [],
  itemCount: 0,
  selectContainer: () => {},
  selectedContainer: null,
  addContainer: () => {},
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

  const [itemCount, setItemCount] = useState<number>(0);
  const [selectedContainer, setSelectedContainer] =
    useState<ItemContainerProps | null>(null);
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
      itemCount: newItemCount,
    } = generateGame({
      difficulty,
    });
    setContainers(newContainers);
    setContainersRemaining(additionalContainers);
    setItemCount(newItemCount);
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
      if (newContainer.items.length === itemCount) {
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
          container.items.length === itemCount &&
          container.items.every((item) => item === container.items[0])
        );
      })
    ) {
      setWon(true);
      setGameOver(true);
    }
  }, [containers]);

  const newGame = () => {
    setInGame(true);
    setWon(false);
    setGameOver(false);
    generatePuzzle();
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
      endGame,
      setDifficulty,
      won,
      gameOver,
      generatePuzzle,
      containersRemaining,
      containers,
      itemCount,
      selectContainer,
      selectedContainer,
      addContainer,
    }),
    [
      inGame,
      newGame,
      endGame,
      setDifficulty,
      won,
      gameOver,
      generatePuzzle,
      containersRemaining,
      containers,
      itemCount,
      selectContainer,
      selectedContainer,
    ]
  );

  return (
    <LogicGameContext.Provider value={value}>
      {children}
    </LogicGameContext.Provider>
  );
};
