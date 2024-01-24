export type Difficulty = "easy" | "medium" | "hard";

export interface Feedback {
  letter: string;
  in_word: boolean;
  in_correct_location: boolean;
  possible_double: boolean;
}

export interface Guess {
  word: string;
  feedback: Feedback[];
}

export interface Suggestion {
  suggestion: string;
  probability: number;
}
