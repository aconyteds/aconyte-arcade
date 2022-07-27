import init, { solve_sudoku, generate_sudoku, generate_suggestions, validate_sudoku } from '../../WASM/sudoku/wasm_sudoku_rust';

// Methods to call the WASM Sudoku Package
export const solveSudoku = async (board: number[], useWasm = true): Promise<number[] | false> => {
    if (useWasm) {
        await init();
        const solvedPuzzle = solve_sudoku(board.join(""));
        if (solvedPuzzle === "Invalid Puzzle Provided") {
            return false;
        }
        return solvedPuzzle.split("").map(Number);
    }
    return [];
};

export const generateSudoku = async (useWasm = true): Promise<number[]> => {
    if (useWasm) {
        await init();
        const puzzle = generate_sudoku();
        const result = puzzle.split("").map(Number);
        return result;
    }
    return [];
}

export const getSuggestions = async (board: number[], row: number, col: number, useWasm = true): Promise<number[]> => {

    if (useWasm) {
        await init();
        const suggestions = generate_suggestions(board.join(""), row, col);
        return suggestions.split("").map(Number);
    }
    return [];
}

export const validatePuzzle = async (board: number[], useWasm = true): Promise<boolean> => {
    if (useWasm) {
        await init();
        const finished = board.every((char) => {
            return char !== 0;
        });

        if (!finished) {
            return false;
        }
        return validate_sudoku(board.join(""));
    }
    return false;
};
