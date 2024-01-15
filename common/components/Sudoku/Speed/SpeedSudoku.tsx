import React, { useEffect, useRef, useState } from "react";
import { useToggle, useInterval } from "../../../hooks";
import { Row, Col, Container } from "react-bootstrap";
import Puzzle, { PuzzleProps } from "./Puzzle";
import { initializeSudokuEngine } from "../engine";
import ScoreScreen, { ScoreScreenProps } from "../ScoreScreen";

const INTERVAL = 1000;
const MAX_PUZZLE_COUNT = 10;

export default function SpeedSudoku() {
  const useWasm = true;
  const [initialized, setInitialized] = useToggle(false);
  const playing = useRef<boolean>(true);
  const [puzzleCount, setPuzzleCount] = useState<number>(0);
  const [gameOver, setGameOver] = useToggle(false);
  const [totalGameTime, setTotalGameTime] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);

  useEffect(() => {
    if (!useWasm) {
      setInitialized(true);
      return;
    }
    initializeSudokuEngine().then(() => {
      setInitialized(true);
    });
  }, []);

  useInterval(() => {
    if (!playing.current || gameOver) {
      return;
    }
    if (puzzleCount >= MAX_PUZZLE_COUNT) {
      setGameOver(true);
      return;
    }

    setTotalGameTime((v) => v + INTERVAL);
    setCurrentScore((v) => {
      const newScore = v - 10;
      if (newScore < 0) {
        setGameOver(true);
        return 0;
      }
      return newScore;
    });
  }, INTERVAL);

  const pause = () => {
    playing.current = false;
  };

  const resume = () => {
    playing.current = true;
  };

  const solvePuzzle = async () => {
    setTotalScore((v) => v + currentScore);
    setPuzzleCount((v) => v + 1);
  };

  const onNewPuzzle = (count: number) => {
    setCurrentScore(count * 100);
    resume();
  };

  const endGame = () => {
    playing.current = false;
    setGameOver(true);
  };

  const puzzleProps: PuzzleProps = {
    useWasm,
    solvePuzzle,
    pause,
    resume,
    onNewPuzzle,
    endGame,
  };

  const playAgain = () => {
    setPuzzleCount(0);
    setTotalGameTime(0);
    setGameOver(false);
    setTotalScore(0);
  };

  if (!initialized) {
    return <div>Loading...</div>;
  }

  const scoreScreenProps: ScoreScreenProps = {
    puzzleCount,
    totalGameTime,
    totalScore,
    playAgain,
  };

  return (
    <Container className="h-100 overflow-auto">
      <Row className="justify-content-center">
        <Col xs="auto">
          <h1>Sudoku</h1>
        </Col>
      </Row>
      {!gameOver ? (
        <>
          <Puzzle {...puzzleProps} />

          <Row className="justify-content-center mt-2">
            <Col xs="auto">
              <h2>Score: {currentScore}</h2>
            </Col>
          </Row>
        </>
      ) : (
        <ScoreScreen {...scoreScreenProps} />
      )}
    </Container>
  );
}
