import React, { useState, useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useWordGameContext } from "./context";
import Character from "./Character";
import Suggestion from "./Suggestion";
import GuessCounter from "./GuessCounter";

export default function Game() {
  const { newGame, endGame, submitGuess, guesses, won, gameOver, wordLength } =
    useWordGameContext();
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const handleGuess = () => {
    submitGuess(currentGuess);
    setCurrentGuess("");
  };

  const disableSubmit = useMemo(() => {
    return currentGuess.length < wordLength || gameOver;
  }, [currentGuess, wordLength]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  };

  return (
    <>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Row className="justify-content-center">
            <Col xs="auto">
              <h1>Word Game</h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto">
              <p>Guess the {wordLength} letter word!</p>
            </Col>
          </Row>
          {guesses.map((guess, index) => {
            return (
              <Row key={index} className="justify-content-center m-1">
                {guess.feedback.map((feedback, indx) => {
                  return (
                    <Col xs="auto" key={indx}>
                      <Character {...feedback} />
                    </Col>
                  );
                })}
              </Row>
            );
          })}
          {!gameOver ? <Suggestion /> : null}
          <Row className="justify-content-center m-2">
            {!gameOver ? (
              <Col>
                <input
                  type="text"
                  className="form-control"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
                  onKeyDown={handleKeyPress}
                  maxLength={wordLength}
                  placeholder={`${wordLength} character word`}
                />
              </Col>
            ) : (
              <Col xs="auto">
                {" "}
                {won ? (
                  <h2 className="text-success">You won!</h2>
                ) : (
                  <h2 className="text-danger">You lost!</h2>
                )}
              </Col>
            )}
          </Row>
          {!gameOver ? <GuessCounter /> : null}
          <Row className="justify-content-center">
            {!gameOver ? (
              <Col xs="auto">
                <Button
                  variant="primary"
                  disabled={disableSubmit}
                  onClick={handleGuess}
                >
                  Guess
                </Button>
              </Col>
            ) : (
              <Col xs="auto">
                <Button variant="primary" onClick={newGame}>
                  Play Again
                </Button>
              </Col>
            )}
            <Col xs="auto">
              <Button variant="danger" onClick={endGame}>
                Return to menu
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
