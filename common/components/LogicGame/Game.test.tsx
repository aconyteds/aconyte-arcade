import { render, act } from "@testing-library/react";
import { ILogicGameContext, useLogicGameContext } from "./context";
import userEvent from "@testing-library/user-event";
import Game from "./Game";

jest.mock("./context");

describe("LogicGame -> Game", () => {
  let fakeContext!: Partial<ILogicGameContext>;
  beforeEach(() => {
    fakeContext = {
      newGame: jest.fn(),
      gameOver: false,
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
      containersRemaining: 1,
      addContainer: jest.fn(),
    };
    (useLogicGameContext as jest.Mock).mockImplementation(
      jest.fn(() => fakeContext)
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Renders the game component", () => {
    const { getByText, getByRole } = render(<Game />);

    const gameTitle = getByText("Logic Game");
    expect(gameTitle).toBeInTheDocument();

    const mainMenuButton = getByRole("button", { name: "Main Menu" });
    expect(mainMenuButton).toBeInTheDocument();
    expect(fakeContext.newGame).toHaveBeenCalledTimes(1);
  });

  it("Calls addContainer when that button is clicked", async () => {
    const { getByRole } = render(<Game />);

    const addContainerButton = getByRole("button", {
      name: /Add Container/,
    });
    expect(addContainerButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(addContainerButton);
    });

    expect(fakeContext.addContainer).toHaveBeenCalled();
  });

  it("Displays 'All containers used' when all containers are added, and button is disabled", () => {
    (useLogicGameContext as jest.Mock).mockImplementation(
      jest.fn(() => ({ ...fakeContext, containersRemaining: 0 }))
    );
    const { getByRole } = render(<Game />);

    const addContainerButton = getByRole("button", {
      name: /All containers used/,
    });
    expect(addContainerButton).toBeInTheDocument();
    expect(addContainerButton).toBeDisabled();
  });

  it("Displays the correct number of remaining containers", () => {
    (useLogicGameContext as jest.Mock).mockImplementation(
      jest.fn(() => ({ ...fakeContext, containersRemaining: 69 }))
    );
    const { getByText, getByRole } = render(<Game />);

    const addContainerButton = getByRole("button", {
      name: /Add Container/,
    });
    expect(addContainerButton).toBeInTheDocument();

    const remainingContainersText = getByText(/remaining\)/);
    expect(remainingContainersText).toHaveTextContent("69 remaining");
  });

  it("Displays the score screen when game is over", () => {
    (useLogicGameContext as jest.Mock).mockImplementation(
      jest.fn(() => ({ ...fakeContext, gameOver: true }))
    );
    const { getByText } = render(<Game />);

    const scoreScreen = getByText("Game Over!");
    expect(scoreScreen).toBeInTheDocument();
  });

  it("Renders the correct number of containers and items", () => {
    const { container } = render(<Game />);

    const containers = container.querySelectorAll(".logic-game-item-container");
    expect(containers).toHaveLength(4);
    const items = container.querySelectorAll(".logic-game-item");
    expect(items).toHaveLength(9);
  });
});
