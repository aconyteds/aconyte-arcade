import { useEffect, useState } from "react";
import { get_suggestion } from "../../WASM/wordGame/rust_word_game";
import { Guess, Suggestion } from "./models";
import { WORDS } from "./context";

type UseSuggestionProps = {
  useJS: boolean;
  guesses: Guess[];
};

const useSuggestion = ({ guesses, useJS }: UseSuggestionProps): Suggestion => {
  const badSuggestion: Suggestion = {
    suggestion: "",
    probability: 0,
  };
  const [currentSuggestion, setCurrentSuggestion] =
    useState<Suggestion>(badSuggestion);

  const getSuggestionJS = (): Suggestion => {
    // Use the guesses to lookup the wordbank to identify a valid solution for the user
    const validAnswers = guesses.reduce(
      (answers, guess): string[] => {
        let possibleAnswers = answers;
        guess.feedback.forEach((feedback, indx) => {
          if (feedback.in_correct_location) {
            possibleAnswers = possibleAnswers.filter(
              (answer) => answer[indx] === feedback.letter,
            );
            return;
          }
          if (feedback.in_word) {
            possibleAnswers = possibleAnswers.filter(
              (answer) =>
                answer.includes(feedback.letter) &&
                answer[indx] !== feedback.letter,
            );
            return;
          }
          possibleAnswers = possibleAnswers.filter(
            (answer) => !answer.includes(feedback.letter),
          );
        });
        return possibleAnswers;
      },
      [...WORDS],
    );
    return {
      suggestion: validAnswers[Math.floor(Math.random() * validAnswers.length)],
      probability: (1 / validAnswers.length) * 100,
    };
  };

  const getSuggestionWS = async (): Promise<Suggestion> => {
    const suggestion = JSON.parse(
      await get_suggestion(JSON.stringify(guesses)),
    ) as Suggestion;
    return suggestion;
  };

  const getSuggestion = async (): Promise<void> => {
    const suggestion = await (useJS ? getSuggestionJS() : getSuggestionWS());
    if (!suggestion) {
      setCurrentSuggestion(badSuggestion);
      return;
    }
    setCurrentSuggestion(suggestion);
  };

  useEffect(() => {
    getSuggestion();
  }, [guesses, useJS]);

  return currentSuggestion;
};

export default useSuggestion;
