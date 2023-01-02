import React, { useEffect, useMemo } from "react";
import { useArray, useToggle } from "../../../hooks";
import { Row, Col, Button, Container } from "react-bootstrap";
import { generateSudoku, validatePuzzle, solveSudoku, initializeSudokuEngine } from "../engine";
import Puzzle from "./Puzzle";

export default function Sudoku() {
  const useWasm = true;
  const { array: puzzle, set: setPuzzle } = useArray<number>([]);
  const { array: progress, set: setProgress } = useArray<number>([]);
  const [playing, setPlaying] = useToggle(true);
  const [victory, setVictory] = useToggle(false);

  const generatePuzzle = async () => {
    const puzzle = await generateSudoku(useWasm);
    setPuzzle(puzzle);
  };

  const newPuzzle = () => {
    generatePuzzle().catch(console.error);
    setPlaying(true);
  };

  useEffect(() => {
    if (useWasm) {
      initializeSudokuEngine().then(() => {
        newPuzzle();
      });
      return;
    }
    newPuzzle();
  }, []);

  const resetPuzzle = () => {
    setPuzzle([...puzzle]);
  };

  const updateProgress = (board: number[]) => {
    setProgress(board);
  };

  const readyToSubmit = useMemo(() => {
    return progress.every((cell) => cell !== 0);
  }, [progress]);

  const submitPuzzle = async () => {
    setVictory(await validatePuzzle(progress, useWasm));
    setPlaying(false);
  };

  const solvePuzzle = async () => {
    const solution = await solveSudoku(puzzle, useWasm);
    if (solution) {
      setPuzzle(solution);
    }
    setVictory(!!solution);
    setPlaying(false);
  };

  return (
    <Container className="h-100 overflow-auto">
      <Row className="justify-content-center">
        <Col xs="auto">
          <h1>Sudoku</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className={`sudoku-puzzle${victory ? " border-success" : ""}`}>
            <Puzzle puzzle={puzzle} updateProgress={updateProgress} useWasm={useWasm} />
          </div>
        </Col>
      </Row>
      {!playing ? (
        <Row className="justify-content-center m-2">
          <Col xs="auto">
            <h1 className={victory ? "text-success" : "text-danger"}>
              {victory ? "You Win!" : "Incorrect Solution"}
            </h1>
          </Col>
        </Row>
      ) : null}
      <Row className="justify-content-center mt-2 gy-3">
        {playing ? (
          <>
            <Col xs={12} lg="auto">
              <Button size="lg" className="w-100" onClick={resetPuzzle}>
                Reset Puzzle
              </Button>
            </Col>
            <Col xs={12} lg="auto">
              <Button
                size="lg"
                className="w-100"
                disabled={!readyToSubmit}
                onClick={submitPuzzle}
              >
                Submit Puzzle
              </Button>
            </Col>
            <Col xs={12} lg="auto">
              <Button
                size="lg"
                className="w-100"
                variant="success"
                onClick={solvePuzzle}
              >
                Solve Puzzle
              </Button>
            </Col>
          </>
        ) : (
          <Col lg="auto">
            <Button
              size="lg"
              className="w-100"
              variant="success"
              onClick={newPuzzle}
            >
              New Puzzle
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
}
