import React, { useContext, useMemo } from "react";
import { WordGameContext } from "./context";
import { Row, Col } from "react-bootstrap";

export default function GuessCounter() {
  const { guessesRemaining } = useContext(WordGameContext);

  const guessesRemainingText = useMemo(() => {
    return guessesRemaining > 1
      ? `Guesses remaining: ${guessesRemaining}`
      : "Last guess!";
  }, [guessesRemaining]);

  const className = useMemo(() => {
    if (guessesRemaining > 4) {
      return "text-success";
    }
    if (guessesRemaining > 1) {
      return "text-warning";
    }
    return "text-danger";
  }, [guessesRemaining]);

  return (
    <Row className="justify-content-center m-1">
      <Col xs="auto">
        <span className={className}>{guessesRemainingText}</span>
      </Col>
    </Row>
  );
}
