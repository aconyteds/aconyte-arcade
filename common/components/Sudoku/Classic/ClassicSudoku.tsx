import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  initializeSudokuEngine,
  generateSudoku,
  validatePuzzle,
  solveSudoku,
} from "../engine";
import { USE_WASM } from "../Menu";
import Board from "./Board";
import ValuePicker from "./ValuePicker";
import { useArray } from "../../../hooks";
import ConfirmationButton from "../../ConfirmationButton";

export default function ClassicSudoku() {
  const { array: board, set: setBoard } = useArray<number>(Array(81).fill(0));
  const [initialized, setInitialized] = useState(false);
  const { array: originalBoard, set: setOriginalBoard } = useArray<number>(
    Array(81).fill(0)
  );
  const { array: suggestions, set: setSuggestions } = useArray<number[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(
    new Set<number>()
  );

  useEffect(() => {
    if (!USE_WASM) {
      setInitialized(true);
      return;
    }
    initializeSudokuEngine().then(() => {
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    const initGame = async () => {
      await initializeSudokuEngine();
      newGame();
    };
    initGame();
  }, []);

  const newGame = async () => {
    const newBoard = await generateSudoku();
    setBoard(newBoard);
    setLockedIndices(
      new Set(newBoard.map((value, index) => (value === 0 ? -1 : index)))
    );
    setOriginalBoard([...newBoard]);
    setSuggestions([]);
    setIsComplete(false);
  };

  const handleCellClick = (index: number) => {
    if (isComplete || originalBoard[index] !== 0) {
      return;
    }
    setSelectedCell(index);
  };

  const checkCompletion = async (currentBoard: number[]) => {
    const isValid = await validatePuzzle(currentBoard);
    setIsComplete(isValid);
  };

  const handleSuggestionsChange = (newValue: number) => {
    if (selectedCell === null) {
      return;
    }
    const prevSuggestions = new Set(suggestions[selectedCell] ?? []);
    if (prevSuggestions.has(newValue)) {
      prevSuggestions.delete(newValue);
    } else {
      prevSuggestions.add(newValue);
    }
    // sort the suggestions
    const newSuggestions = Array.from(prevSuggestions).sort();
    const newSuggestionsArray = [...suggestions];
    newSuggestionsArray[selectedCell] = newSuggestions;
    setSuggestions(newSuggestionsArray);
  };

  const handleValueChange = (newValue: number, isSuggestion: boolean) => {
    if (selectedCell === null) {
      return;
    }
    if (isSuggestion) {
      handleSuggestionsChange(newValue);
      return;
    }
    const newBoard = [...board];
    newBoard[selectedCell] = newValue;
    setBoard(newBoard);
    checkCompletion(newBoard);
  };

  const cheat = async () => {
    const solution = await solveSudoku(originalBoard);
    if (!solution) {
      return;
    }
    setBoard(solution);
    checkCompletion(solution);
  };

  const handleClear = () => {
    if (selectedCell === null) {
      return;
    }
    const newBoard = [...board];
    newBoard[selectedCell] = 0;
    setBoard(newBoard);
    // clear suggestions
    const newSuggestionsArray = [...suggestions];
    newSuggestionsArray[selectedCell] = [];
    setSuggestions(newSuggestionsArray);
  };

  return (
    <Container>
      <Row className="justify-content-center mt-3">
        <Col xs="auto">
          <h2>Classic Sudoku</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={6}>
          <div
            className={`sudoku-puzzle border ${
              isComplete ? "border-success" : "border-dark"
            }`}
          >
            {initialized && (
              <Board
                puzzle={board}
                lockedIndices={lockedIndices}
                suggestions={suggestions}
                selectedCell={selectedCell}
                victory={isComplete}
                selectCell={handleCellClick}
              />
            )}
          </div>
        </Col>
        <Col xs="auto">
          {isComplete ? null : (
            <ValuePicker
              onValueSelected={handleValueChange}
              onClear={handleClear}
            />
          )}
        </Col>
      </Row>
      {isComplete && (
        <Row className="justify-content-center mt-3">
          <Col xs="auto">
            <h3>Congratulations! You've completed the puzzle!</h3>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center mt-3">
        {isComplete ? (
          <Col xs="auto">
            <Button variant="success" onClick={newGame}>
              New Game
            </Button>
          </Col>
        ) : (
          <>
            <Col xs="auto">
              <ConfirmationButton variant="warning" onComplete={cheat}>
                Cheat
              </ConfirmationButton>
            </Col>
            <Col xs="auto">
              <ConfirmationButton onComplete={newGame}>
                New Game
              </ConfirmationButton>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}
