import { shuffle } from "../../utilities";
import init, {
  solve_sudoku,
  generate_sudoku,
  generate_suggestions,
  validate_sudoku,
  InitOutput
} from "../../WASM/sudoku/wasm_sudoku_rust";

// an array of all the indexes in a sudoku puzzle
const INDEXES = Array.from(Array(81).keys());

interface SudokuEngine {
  solve_sudoku: (puzzle: string) => string;
  generate_sudoku: () => string;
  generate_suggestions: (puzzle: string, row: number, col: number) => string;
  validate_sudoku: (puzzle: string) => boolean;
  module: InitOutput;
};

let sudokuEngine: null | SudokuEngine = null;

export const initializeSudokuEngine = async (): Promise<SudokuEngine> => {
  const loader = new Promise<SudokuEngine>(async (resolve) => {
    if (sudokuEngine) {
      resolve(sudokuEngine);
      return;
    }
    const module = await init();
    sudokuEngine = {
      module,
      solve_sudoku,
      generate_sudoku,
      generate_suggestions,
      validate_sudoku
    };
    resolve(sudokuEngine);
  });
  return loader;
};

const validate_wasm = async (board: number[]): Promise<boolean> => {
  const engine = await initializeSudokuEngine();
  return await engine.validate_sudoku(board.join(""));
}

const isValid = (board: number[], index: number, value?: number): boolean => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  if (!value) {
    value = board[index];
  }

  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row * 9 + i] === value) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && board[col + i * 9] === value) {
      return false;
    }
  }

  // Check box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        boxRow + i !== row &&
        boxCol + j !== col &&
        board[(boxRow + i) * 9 + boxCol + j] === value
      ) {
        return false;
      }
    }
  }
  return true;
};

export const validatePuzzle = async (
  board: number[],
  useWasm = true
): Promise<boolean> => {
  const finished = board.every((char) => {
    return char !== 0;
  });

  if (!finished) {
    return false;
  }

  if (useWasm) {
    return await validate_wasm(board);
  }

  return board.every((entry) => (isValid(board, entry)));
};

const solve_wasm = async (board: number[]): Promise<number[] | false> => {
  const engine = await initializeSudokuEngine();
  const solvedPuzzle = await engine.solve_sudoku(board.join(""));
  if (solvedPuzzle === "Invalid Puzzle Provided") {
    return false;
  }
  return solvedPuzzle.split("").map(Number);
}


/**
 * 
 * Method to solve a Sudoku puzzle using backtracking, iteratively. Mutates the input board array.
 * 
 * @param board array of size 81 which will be mutated to the solved puzzle
 * @param reverse whether to solve it high to low or low to high
 * @returns Boolean indicating if the puzzle was solved, or if there was an error solving (invalid puzzle)
 */
const solve = (board: number[], reverse: boolean = false): boolean => {
  const boardSize = 9;
  let row: number = 0;
  let col: number = 0;
  let unsolvedIndexes = new Array<number>();
  let backtrack = false;
  outer:
  while (true) {
    if (col === boardSize) {
      col = 0;
      row++;
      if (row === boardSize) {
        break outer;
      }
      continue outer;
    }
    const index = row * boardSize + col;
    if (board[index] === 0 || backtrack) {
      let start = reverse ? 9 : 1;
      let end = reverse ? 0 : 10;
      if (backtrack) {
        start = board[index];
      }
      checkValues:
      while (start !== end) {
        let i = start;
        start += reverse ? -1 : 1;
        if (i === 0 || (backtrack && i === board[index])) {
          continue checkValues;
        }

        if (isValid(board, index, i)) {
          backtrack = false;
          unsolvedIndexes.push(index);
          board[index] = i;
          col++;
          continue outer;
        }
      }
      if (unsolvedIndexes.length === 0) {
        return false;
      }
      // backtrack
      backtrack = true;
      board[index] = 0;
      const lastUnsolvedIndex = unsolvedIndexes.pop();
      if (lastUnsolvedIndex === undefined) {
        return false;
      }
      row = Math.floor(lastUnsolvedIndex / boardSize);
      col = lastUnsolvedIndex % boardSize;
      continue outer;
    }
    col++;
  }
  return true;
};

// Methods to call the WASM Sudoku Package
export const solveSudoku = async (
  board: number[],
  useWasm = true
): Promise<number[] | false> => {
  if (useWasm) {
    return await solve_wasm(board);
  }

  const boardCopy = [...board];
  if (!solve(boardCopy)) {
    return false;
  }
  return boardCopy;
};

const generate_suggestions_wasm = async (board: number[], row: number, col: number): Promise<number[]> => {
  const engine = await initializeSudokuEngine();
  const suggestions = await engine.generate_suggestions(board.join(""), row, col);
  return suggestions.split("").map(Number);
}

const generateSuggestions = (board: number[], row: number, col: number): number[] => {
  const suggestions: number[] = [];
  const index = row * 9 + col;
  for (let i = 1; i <= 9; i++) {
    if (isValid(board, index, i)) {
      suggestions.push(i);
    }
  }
  return suggestions;
}

export const getSuggestions = async (
  board: number[],
  row: number,
  col: number,
  useWasm = true
): Promise<number[]> => {
  if (useWasm) {
    return await generate_suggestions_wasm(board, row, col);
  }
  return generateSuggestions(board, row, col);
};

const generate_wasm = async (): Promise<number[]> => {
  const engine = await initializeSudokuEngine();
  const puzzle = await engine.generate_sudoku();
  const result = puzzle.split("").map(Number);
  return result;
};

const generate = (fillPercentage: number): number[] => {
  const board = new Array<number>(81).fill(0);
  const zero_values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Fill the first row
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * zero_values.length);
    board[i] = zero_values[randomIndex];
    zero_values.splice(randomIndex, 1);
  }
  // Fill the rest of the board
  solve(board);

  const shuffledBoard = shuffle(INDEXES);
  for (let i = 0; i < Math.floor(shuffledBoard.length * (fillPercentage / 100)); i++) {
    board[shuffledBoard[i]] = 0;
  }
  return board;
}


export const generateSudoku = async (useWasm = true, fillPercentage = 50): Promise<number[]> => {
  if (useWasm) {
    return await generate_wasm();
  }

  return generate(fillPercentage);
};
