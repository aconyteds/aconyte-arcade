import React from "react";
import { render, act } from "@testing-library/react";
import { LogicGameContextProvider, useLogicGameContext } from "./context";
import { Difficulty } from "./models";
import userEvent from "@testing-library/user-event";
import * as engineModule from "./engine";
import { GenerateGameResult } from "./engine";

jest.mock("./engine", () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual("./engine");
  const mockGenerateGame = (): GenerateGameResult => ({
    containers: [
      {
        indx: 0,
        items: ["otter", "otter"],
      },
      {
        indx: 1,
        items: ["otter"],
      },
      {
        indx: 2,
        items: ["fish", "fish", "fish"],
      },
      {
        indx: 3,
        items: ["dragon", "dragon", "dragon"],
      },
    ],
    containerLimit: 3,
    uniqueItemTypeCount: 3,
    additionalContainers: 1,
  });

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    generateGame: mockGenerateGame,
  };
});

const TestComponent = () => {
  const {
    inGame,
    newGame,
    endGame,
    startGame,
    won,
    gameOver,
    containersRemaining,
    containers,
    containerLimit,
    selectContainer,
    selectedContainer,
    addContainer,
    gameTime,
  } = useLogicGameContext();

  return (
    <>
      <button onClick={newGame}>New Game</button>
      <button onClick={endGame}>End Game</button>
      <button onClick={() => startGame(Difficulty.Easy)}>Easy</button>
      <button onClick={() => startGame(Difficulty.Medium)}>Medium</button>
      <button onClick={() => startGame(Difficulty.Hard)}>Hard</button>
      <div data-testid="in-game">{inGame.toString()}</div>
      <div data-testid="won">{won.toString()}</div>
      <div data-testid="game-over">{gameOver.toString()}</div>
      <div data-testid="containers-remaining">{containersRemaining}</div>
      <div data-testid="container-limit">{containerLimit}</div>
      <div data-testid="game-time">{gameTime}</div>
      <div data-testid="selected-container">
        {selectedContainer?.indx.toString()}
      </div>
      <div data-testid="containers">
        {containers.map((container) => (
          <div
            title="container"
            key={container.indx}
            onClick={() => selectContainer(container)}
          >
            {container.indx}
            {container.items.map((item, indx) => (
              <div title="item" key={`item-${container.indx}-${indx}`}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={() => selectContainer(containers[0])}>
        Select First Container
      </button>
      <button onClick={addContainer}>Add Container</button>
    </>
  );
};

describe("LogicGame -> Context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it.each([
    [null, 6, 16],
    ["Easy", 6, 16],
    ["Medium", 8, 30],
    ["Hard", 8, 42],
  ])(
    "Renders the correct number of containers and items when clicking %s",
    async (buttonName, containerCount, itemCount) => {
      const actualMyFunction = jest.requireActual("./engine").generateGame;

      // Use spyOn and call the actual implementation
      const realSpy = jest.spyOn(engineModule, "generateGame");

      realSpy.mockImplementation(actualMyFunction);

      const { getByText, getAllByTitle } = render(
        <LogicGameContextProvider>
          <TestComponent />
        </LogicGameContextProvider>
      );
      if (buttonName) {
        const button = getByText(buttonName);
        await act(async () => {
          await userEvent.click(button);
        });
      }

      const newGameButton = getByText("New Game");
      expect(newGameButton).toBeInTheDocument();
      await act(async () => {
        await userEvent.click(newGameButton);
      });
      const containers = getAllByTitle("container");
      expect(containers.length).toBe(containerCount);
      const items = getAllByTitle("item");
      expect(items.length).toBe(itemCount);
      realSpy.mockRestore();
    }
  );

  it("Properly sets inGame when starting game", async () => {
    const { getByText, getByTestId } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    const inGame = getByTestId("in-game");
    expect(inGame).toBeInTheDocument();
    expect(inGame).toHaveTextContent("false");
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    expect(inGame).toHaveTextContent("true");
  });

  it("Properly handles updating the available container when adding a container", async () => {
    const { getByText, getByTestId, queryByTitle, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    const containersRemaining = getByTestId("containers-remaining");
    const containers = queryByTitle("container");
    expect(containersRemaining).toBeInTheDocument();
    expect(containersRemaining).toHaveTextContent("0");
    expect(containers).toBeNull();
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    expect(containersRemaining).toHaveTextContent("1");
    const addContainerButton = getByText("Add Container");
    expect(addContainerButton).toBeInTheDocument();
    expect(getAllByTitle("container")).toHaveLength(4);
    await act(async () => {
      await userEvent.click(addContainerButton);
    });
    expect(containersRemaining).toHaveTextContent("0");
    expect(getAllByTitle("container")).toHaveLength(5);
    await act(async () => {
      await userEvent.click(addContainerButton);
    });
    expect(containersRemaining).toHaveTextContent("0");
    expect(getAllByTitle("container")).toHaveLength(5);
  });

  it("Properly handles selecting a container", async () => {
    const { getByText, getByTestId, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    const selectedContainer = getByTestId("selected-container");
    expect(selectedContainer).toBeInTheDocument();
    expect(selectedContainer).toHaveTextContent("");
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    expect(selectedContainer).toHaveTextContent("");
    await act(async () => {
      await userEvent.click(getAllByTitle("container")[0]);
    });
    expect(selectedContainer).toHaveTextContent("0");
  });

  it("Properly handles moving an item to an empty container", async () => {
    const { getByText, getByTestId, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    const selectedContainer = getByTestId("selected-container");
    expect(selectedContainer).toBeInTheDocument();
    expect(selectedContainer).toHaveTextContent("");
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    let containers = getAllByTitle("container");
    await act(async () => {
      await userEvent.click(containers[0]);
    });
    expect(selectedContainer).toHaveTextContent("0");
    const addContainerButton = getByText("Add Container");
    await act(async () => {
      await userEvent.click(addContainerButton);
    });
    containers = getAllByTitle("container");
    await act(async () => {
      await userEvent.click(containers[containers.length - 1]);
    });
    expect(
      containers[containers.length - 1].querySelectorAll("[title=item]")
    ).toHaveLength(1);
  });

  it("Properly handles moving an item to a container with the same item", async () => {
    const { getByText, getByTestId, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    const selectedContainer = getByTestId("selected-container");
    expect(selectedContainer).toBeInTheDocument();
    expect(selectedContainer).toHaveTextContent("");
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    let containers = getAllByTitle("container");

    const sourceContainer = containers[1];
    const targetContainer = containers[0];
    await act(async () => {
      await userEvent.click(sourceContainer);
    });
    expect(selectedContainer).toHaveTextContent("1");
    await act(async () => {
      await userEvent.click(targetContainer);
    });
    expect(
      getAllByTitle("container")[1].querySelectorAll("[title=item]")
    ).toHaveLength(0);
    expect(
      getAllByTitle("container")[0].querySelectorAll("[title=item]")
    ).toHaveLength(3);
    expect(selectedContainer).toHaveTextContent("");
  });

  it("changes the selected container if the new container is full", async () => {
    const { getByText, getByTestId, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    const selectedContainer = getByTestId("selected-container");
    expect(selectedContainer).toBeInTheDocument();
    expect(selectedContainer).toHaveTextContent("");
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    const containers = getAllByTitle("container");
    await act(async () => {
      await userEvent.click(containers[1]);
    });
    expect(selectedContainer).toHaveTextContent("1");
    await act(async () => {
      await userEvent.click(containers[2]);
    });
    expect(selectedContainer).toHaveTextContent("2");
  });

  it("Properly sets won to true when game is won", async () => {
    const { getByText, getByTestId, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    const containers = getAllByTitle("container");
    await act(async () => {
      await userEvent.click(containers[1]);
    });
    await act(async () => {
      await userEvent.click(containers[0]);
    });
    expect(
      getAllByTitle("container")[0].querySelectorAll("[title=item]")
    ).toHaveLength(3);
    const won = getByTestId("won");
    expect(won).toBeInTheDocument();
    expect(won).toHaveTextContent("true");
    const inGame = getByTestId("in-game");
    expect(inGame).toBeInTheDocument();
    expect(inGame).toHaveTextContent("true");
    const gameOver = getByTestId("game-over");
    expect(gameOver).toBeInTheDocument();
    expect(gameOver).toHaveTextContent("true");
    const gameTime = getByTestId("game-time");
    expect(gameTime).toBeInTheDocument();
    expect(gameTime.textContent).not.toBe("");
  });

  it("Properly sets won to false when game is lost", async () => {
    const mockGenerateGame = (): GenerateGameResult => ({
      containers: [
        {
          indx: 0,
          items: ["otter", "otter", "fish"],
        },
        {
          indx: 2,
          items: ["fish", "fish", "otter"],
        },
        {
          indx: 3,
          items: ["dragon", "dragon", "dragon"],
        },
      ],
      containerLimit: 3,
      uniqueItemTypeCount: 3,
      additionalContainers: 0,
    });
    const generateGameSpy = jest.spyOn(
      engineModule,
      "generateGame" as keyof typeof engineModule
    );
    generateGameSpy.mockImplementation(mockGenerateGame);
    const { getByText, getByTestId, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    const containers = getAllByTitle("container");
    await act(async () => {
      await userEvent.click(containers[1]);
    });
    await act(async () => {
      await userEvent.click(containers[0]);
    });
    expect(
      getAllByTitle("container")[0].querySelectorAll("[title=item]")
    ).toHaveLength(3);
    const gameOver = getByTestId("game-over");
    expect(gameOver).toBeInTheDocument();
    expect(gameOver).toHaveTextContent("true");
    const won = getByTestId("won");
    expect(won).toBeInTheDocument();
    expect(won).toHaveTextContent("false");
    const inGame = getByTestId("in-game");
    expect(inGame).toBeInTheDocument();
    expect(inGame).toHaveTextContent("true");
    generateGameSpy.mockRestore();
  });

  it('Properly exits the game when "End Game" is clicked', async () => {
    const { getByText, getByTestId, getAllByTitle } = render(
      <LogicGameContextProvider>
        <TestComponent />
      </LogicGameContextProvider>
    );
    const startGameButton = getByText("New Game");
    expect(startGameButton).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(startGameButton);
    });
    const containers = getAllByTitle("container");
    await act(async () => {
      await userEvent.click(containers[1]);
    });
    await act(async () => {
      await userEvent.click(containers[0]);
    });
    expect(
      getAllByTitle("container")[0].querySelectorAll("[title=item]")
    ).toHaveLength(3);
    const gameOver = getByTestId("game-over");
    expect(gameOver).toBeInTheDocument();
    expect(gameOver).toHaveTextContent("true");
    const won = getByTestId("won");
    expect(won).toBeInTheDocument();
    expect(won).toHaveTextContent("true");
    const inGame = getByTestId("in-game");
    expect(inGame).toBeInTheDocument();
    expect(inGame).toHaveTextContent("true");
    const endGameButton = getByText("End Game");
    expect(endGameButton).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(endGameButton);
    });
    expect(gameOver).toHaveTextContent("false");
    expect(won).toHaveTextContent("false");
    expect(inGame).toHaveTextContent("false");
  });
});
