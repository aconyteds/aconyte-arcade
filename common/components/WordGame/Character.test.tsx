import { render } from "@testing-library/react";
import Character from "./Character";

describe("Character", () => {
  const defaultProps = {
    letter: "A",
    in_word: false,
    in_correct_location: false,
    possible_double: false,
  };
  test("When in the right place, it renders with a success background", () => {
    const { getByText } = render(
      <Character
        {...{ ...defaultProps, in_word: true, in_correct_location: true }}
      />
    );

    const characterElement = getByText("A");
    expect(characterElement).toBeInTheDocument();
    const container = characterElement.parentElement;
    expect(container).toHaveClass("bg-success");
    expect(container).toHaveClass("text-white");
  });

  test("Renders a danger background if it is not in the word", () => {
    const { getByText } = render(<Character {...defaultProps} />);

    const characterElement = getByText("A");
    expect(characterElement).toBeInTheDocument();
    const container = characterElement.parentElement;
    expect(container).toHaveClass("bg-danger");
    expect(container).not.toHaveClass("text-white");
  });

  test("Renders a warning background if it is in the word but not in the right place", () => {
    const { getByText } = render(
      <Character {...{ ...defaultProps, in_word: true }} />
    );

    const characterElement = getByText("A");
    expect(characterElement).toBeInTheDocument();
    const container = characterElement.parentElement;
    expect(container).toHaveClass("bg-warning");
    expect(container).toHaveClass("text-white");
  });

  test("Underlines the letter if it is a possible double", () => {
    const { getByText } = render(
      <Character {...{ ...defaultProps, possible_double: true }} />
    );

    const characterElement = getByText("A");
    expect(characterElement).toBeInTheDocument();
    expect(characterElement).toHaveStyle("text-decoration: underline");
  });
});
