import React, { useContext } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { WordGameContext, Difficulty } from "./context";

export default function Menu() {
  const { setDifficulty, newGame } = useContext(WordGameContext);

  const handleDifficulty = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    newGame();
  };

  return (
    <Row className="justify-content-center text-center align-items-center h-100">
      <Col xs="auto">
        <Row>
          <Col>
            <h1>
              Welcome to the W<span className="text-warning">o</span>
              <span className="text-success">r</span>d Game
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Select a difficulty!</p>
          </Col>
        </Row>
        <Row className="justify-content-center mt-2">
          <Col lg={6}>
            <Button
              className="w-100"
              variant="success"
              size="lg"
              onClick={() => handleDifficulty("easy")}
            >
              Easy
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-center mt-2">
          <Col lg={6}>
            <Button
              className="w-100"
              variant="warning"
              size="lg"
              onClick={() => handleDifficulty("medium")}
            >
              Medium
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-center mt-2">
          <Col lg={6}>
            <Button
              className="w-100"
              variant="danger"
              size="lg"
              onClick={() => handleDifficulty("hard")}
            >
              Hard
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
