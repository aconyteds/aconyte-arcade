import React, {
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useEffect,
  useState,
} from "react";
import { get_feedback, get_word } from "../../WASM/wordGame/rust_word_game";
import { useArray, useToggle } from "../../hooks";
import { Difficulty, Guess, Feedback, Suggestion } from "./models";
import useSuggestion from "./useSuggestion";

// Array of words to use when in JS mode
export const WORDS = [
  "chair",
  "couch",
  "table",
  "flair",
  "flier",
  "steer",
  "stair",
  "staff",
  "stake",
  "steak",
  "peach",
  "pearl",
  "apple",
  "snail",
  "sneak",
  "snake",
  "flake",
  "shake",
];

interface IWordGameContext {
  inGame: boolean;
  newGame: () => void;
  endGame: () => void;
  suggestion: Suggestion;
  setDifficulty: (difficulty: Difficulty) => void;
  submitGuess: (guess: string) => void;
  guesses: Guess[];
  won: boolean;
  gameOver: boolean;
  wordLength: number;
  guessesRemaining: number;
}

export const WordGameContext = createContext<IWordGameContext>({
  inGame: false,
  newGame: () => {},
  endGame: () => {},
  suggestion: { suggestion: "", probability: 0 },
  setDifficulty: () => {},
  submitGuess: () => {},
  guesses: [],
  won: false,
  gameOver: false,
  wordLength: 0,
  guessesRemaining: 0,
});

export function useWordGameContext(): IWordGameContext {
  const value = useContext(WordGameContext);
  if (value === null) throw new Error("No Word Game Context Provided");
  return value;
}

export const WordGameContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const useJS = false;
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [inGame, setInGame] = useToggle(false);
  const [word, setWord] = useState<string>("");
  const totalGuesses = useMemo(
    () => (difficulty === "easy" ? 10 : difficulty === "medium" ? 7 : 5),
    [difficulty]
  );
  const [gameOver, setGameOver] = useToggle(false);
  const [won, setWon] = useToggle(false);
  const {
    array: guesses,
    push: pushGuess,
    set: setGuesses,
  } = useArray<Guess>([]);
  const suggestion = useSuggestion({ guesses, useJS });

  const getRandomWordJS = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    const randomWord = WORDS[randomIndex];
    return randomWord;
  };

  const getRandomWordWS = async (): Promise<string> => {
    return await get_word();
  };

  const newGame = async () => {
    setGuesses([]);
    setWord(useJS ? getRandomWordJS() : await getRandomWordWS());
    setInGame(true);
    setGameOver(false);
    setWon(false);
  };

  // Method to take a submitted guess and determine if it is correct
  const handleGuessJS = (currentGuess: string): Feedback[] => {
    // Check the letters in the guess against the letters in the word
    // If the letter is in the word, and the index matches, it is correct
    // If the letter is in the word, but the index does not match, it is inWord
    // If the letter is not in the word, it is not inWord
    const feedback: Feedback[] = currentGuess.split("").map((letter, indx) => {
      const isInWord = word.includes(letter);
      const isCorrect = isInWord && word.indexOf(letter) === indx;
      // Check if the letter is possibly a double
      const isDouble =
        word.split("").reduce((count, currLetter) => {
          if (letter === currLetter) {
            return ++count;
          }
          return count;
        }, 0) > 1;
      return {
        letter,
        in_word: isInWord,
        in_correct_location: isCorrect,
        possible_double: isDouble,
      };
    });
    return feedback;
  };

  const handleGuessWS = async (currentGuess: string): Promise<Feedback[]> => {
    const feedback = JSON.parse(await get_feedback(currentGuess, word));
    return feedback;
  };

  const submitGuess = async (guess: string) => {
    // if the game is over, do not accept any more guesses
    if (gameOver) {
      return;
    }
    const feedback: Feedback[] = useJS
      ? handleGuessJS(guess)
      : await handleGuessWS(guess);
    pushGuess({ word: guess, feedback });
    if (feedback.every((f) => f.in_correct_location)) {
      setWon(true);
      setGameOver(true);
    }
  };

  const endGame = () => {
    setInGame(false);
  };

  useEffect(() => {
    if (gameOver) {
      return;
    }
    if (guesses.length >= totalGuesses) {
      setGameOver(true);
    }
  }, [guesses, totalGuesses]);

  const value: IWordGameContext = useMemo(
    () => ({
      inGame,
      newGame,
      endGame,
      suggestion,
      setDifficulty,
      submitGuess,
      guesses,
      won,
      gameOver,
      wordLength: word.length,
      guessesRemaining: totalGuesses - guesses.length,
    }),
    [
      inGame,
      newGame,
      endGame,
      suggestion,
      setDifficulty,
      submitGuess,
      guesses,
      won,
      gameOver,
    ]
  );

  return (
    <>
      <WordGameContext.Provider value={value}>
        {children}
      </WordGameContext.Provider>
    </>
  );
};
