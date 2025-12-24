import { render, fireEvent } from "@testing-library/react";
import { ILogicGameContext, useLogicGameContext } from "./context";
import { ScoreScreen } from "./ScoreScreen";

jest.mock("./context");

describe("LogicGame -> ScoreScreen", () => {
  let fakeContext!: Partial<ILogicGameContext>;

  beforeEach(() => {
    fakeContext = {
      newGame: jest.fn(),
      gameTime: "00:05",
      won: true,
      containersRemaining: 2,
    };
    (useLogicGameContext as jest.Mock).mockReturnValue(fakeContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the game over message", () => {
    const { getByText } = render(<ScoreScreen />);
    const gameOverText = getByText("Game Over!");
    expect(gameOverText).toBeInTheDocument();
  });

  it("displays the correct game time", () => {
    const { getByText } = render(<ScoreScreen />);
    const gameTimeText = getByText(/You finished in 00:05./);
    expect(gameTimeText).toBeInTheDocument();
  });

  it("displays the remaining containers message", () => {
    const { getByText } = render(<ScoreScreen />);
    const remainingContainersText = getByText(
      /You still had 2 containers remaining./,
    );
    expect(remainingContainersText).toBeInTheDocument();
  });

  it("displays the remaining container message", () => {
    (useLogicGameContext as jest.Mock).mockReturnValue({
      ...fakeContext,
      containersRemaining: 1,
    });
    const { getByText } = render(<ScoreScreen />);
    const remainingContainersText = getByText(
      /You still had 1 container remaining./,
    );
    expect(remainingContainersText).toBeInTheDocument();
  });

  it("displays the no remaining containers message", () => {
    (useLogicGameContext as jest.Mock).mockReturnValue({
      ...fakeContext,
      containersRemaining: 0,
    });
    const { getByText } = render(<ScoreScreen />);
    const remainingContainersText = getByText(/It took every container./);
    expect(remainingContainersText).toBeInTheDocument();
  });

  it("displays the no more moves message", () => {
    (useLogicGameContext as jest.Mock).mockReturnValue({
      ...fakeContext,
      won: false,
    });
    const { getByText } = render(<ScoreScreen />);
    const noMoreMovesText = getByText("No More Moves!");
    expect(noMoreMovesText).toBeInTheDocument();
  });

  it("calls newGame when Play Again button is clicked", () => {
    const { getByText } = render(<ScoreScreen />);
    const playAgainButton = getByText(/Play Again/);
    fireEvent.click(playAgainButton);
    expect(fakeContext.newGame).toHaveBeenCalledTimes(1);
  });

  it("navigates to the main menu when Main Menu button is clicked", () => {
    const { getByText } = render(<ScoreScreen />);
    const mainMenuButton = getByText("Main Menu");
    expect(mainMenuButton).toHaveAttribute("href", "/games/logicGame");
  });
});
