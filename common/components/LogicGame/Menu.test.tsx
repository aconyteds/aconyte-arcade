import { render, fireEvent } from "@testing-library/react";
import Menu from "./Menu";
import { useLogicGameContext } from "./context";
import { Difficulty } from "./models";

jest.mock("./context");

describe("LogicGame -> Menu", () => {
  let fakeContext: any;

  beforeEach(() => {
    fakeContext = {
      startGame: jest.fn(),
    };
    (useLogicGameContext as jest.Mock).mockReturnValue(fakeContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Renders the menu component", () => {
    const { getByText } = render(<Menu />);

    const gameTitle = getByText("Logic Game");
    expect(gameTitle).toBeInTheDocument();
  });

  it("Calls startGame with Easy difficulty when Easy button is clicked", () => {
    const { getByText } = render(<Menu />);

    const easyButton = getByText("Easy");
    fireEvent.click(easyButton);

    expect(fakeContext.startGame).toHaveBeenCalledWith(Difficulty.Easy);
  });

  it("Calls startGame with Medium difficulty when Medium button is clicked", () => {
    const { getByText } = render(<Menu />);

    const mediumButton = getByText("Medium");
    fireEvent.click(mediumButton);

    expect(fakeContext.startGame).toHaveBeenCalledWith(Difficulty.Medium);
  });

  it("Calls startGame with Hard difficulty when Hard button is clicked", () => {
    const { getByText } = render(<Menu />);

    const hardButton = getByText("Hard");
    fireEvent.click(hardButton);

    expect(fakeContext.startGame).toHaveBeenCalledWith(Difficulty.Hard);
  });
});
