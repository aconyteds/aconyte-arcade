import React, { useEffect } from "react";
import { useArray, useToggle } from "../../../hooks";
import { Row, Col, Button, Container } from "react-bootstrap";
import { generateSudoku, validatePuzzle } from "../engine";
import Board from "./Board";

export type PuzzleProps = {
  useWasm: boolean;
  solvePuzzle: () => void;
  onNewPuzzle: (count: number) => void;
  pause: () => void;
  resume: () => void;
  endGame: () => void;
};

export default function Puzzle({
  useWasm = true,
  solvePuzzle,
  onNewPuzzle,
  pause,
  resume,
  endGame,
}: PuzzleProps) {
  const { array: puzzle, set: setPuzzle } = useArray<number>([]);
  const { array: progress, set: setProgress } = useArray<number>([]);
  const [victory, setVictory] = useToggle(false);

  const generatePuzzle = async () => {
    pause();
    const puzzle = await generateSudoku(useWasm);
    setPuzzle(puzzle);
    const emptyCount = puzzle.filter((cell) => cell === 0).length;
    onNewPuzzle(emptyCount);
  };

  const newPuzzle = () => {
    setVictory(false);
    generatePuzzle().catch(console.error);
  };

  useEffect(() => {
    newPuzzle();
  }, []);

  const resetPuzzle = () => {
    setPuzzle([...puzzle]);
  };

  useEffect(() => {
    if (!progress.length) {
      return;
    }
    const checkVictory = async () => {
      if (progress.some((cell) => cell === 0)) {
        return;
      }
      pause();
      const victory = await validatePuzzle(progress, useWasm);
      setVictory(victory);
      if (!victory) {
        resume();
        return;
      }
      solvePuzzle();
    };
    checkVictory();
  }, [progress]);

  const updateProgress = (board: number[]) => {
    setProgress(board);
  };

  return (
    <>
      <Row className="justify-content-center">
        <Col lg={6}>
          <div
            className={`sudoku-puzzle border ${
              victory ? "border-success" : "border-dark"
            }`}
          >
            {victory ? (
              <div className="victory-overlay">
                <Container>
                  <Row className="justify-content-center mt-2">
                    <Col xs="auto">
                      <h2 className="text-success victory-message">
                        Puzzle Completed!
                      </h2>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mt-2">
                    <Col xs="auto">
                      <Button size="lg" className="w-100" onClick={newPuzzle}>
                        New Puzzle
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </div>
            ) : null}
            <Board
              puzzle={puzzle}
              updateProgress={updateProgress}
              useWasm={useWasm}
              victory={victory}
            />
          </div>
        </Col>
      </Row>
      {!victory ? (
        <Row className="justify-content-center mt-2 gy-3">
          <Col xs="auto">
            <Button
              size="lg"
              className="w-100"
              onClick={resetPuzzle}
              disabled={victory}
            >
              Reset Puzzle
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              size="lg"
              className="w-100"
              variant="danger"
              onClick={endGame}
            >
              End Game
            </Button>
          </Col>
        </Row>
      ) : null}
    </>
  );
}
