import React from "react";
import {
  Row,
  Col,
  Button,
  Container,
  ListGroupItem,
  ListGroup,
} from "react-bootstrap";
import { useLogicGameContext } from "./context";
import { Difficulty } from "./models";

export const USE_WASM = true;

export default function Menu() {
  const { startGame } = useLogicGameContext();

  const handleDifficulty = (difficulty: Difficulty) => {
    startGame(difficulty);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs="auto">
          <h1>Logic Game</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <p className="text-center">
            Welcome to the Logic Game! This game is played by matching items
            when putting them into containers.
          </p>
          <ListGroup>
            <ListGroupItem>
              You may not have more than (4 easy, 5 medium, 6 hard) items in a
              container.
            </ListGroupItem>
            <ListGroupItem>
              You may only remove the "top" item from a container.
            </ListGroupItem>
            <ListGroupItem>
              You may not add an item on top of a different item in another
              container.
            </ListGroupItem>
            <ListGroupItem>
              You must be able to move an item into another container for it to
              be removed from a container.
            </ListGroupItem>
            <ListGroupItem>
              You are allowed to add a limited number of empty containers if you
              get stuck.
            </ListGroupItem>
            <ListGroupItem>
              The game ends when there are no more viable moves OR you have
              properly matched all items in their containers.
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
      <Row className="justify-content-center mt-2">
        <Col md={6}>
          <Row className="flex-column gap-2 justify-content-center">
            <Col xs="auto">
              <Button
                className="w-100"
                variant="success"
                size="lg"
                onClick={() => handleDifficulty(Difficulty.Easy)}
              >
                Easy
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                className="w-100"
                variant="warning"
                size="lg"
                onClick={() => handleDifficulty(Difficulty.Medium)}
              >
                Medium
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                className="w-100"
                variant="danger"
                size="lg"
                onClick={() => handleDifficulty(Difficulty.Hard)}
              >
                Hard
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
