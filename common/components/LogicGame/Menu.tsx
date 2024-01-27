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

export const USE_WASM = true;

export default function Menu() {
  const { newGame } = useLogicGameContext();
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
              You may not have more than x items in a container
            </ListGroupItem>
            <ListGroupItem>
              You may not play an item into a container which does not have the
              same type "on top"
            </ListGroupItem>
            <ListGroupItem>
              You may only remove the "top" item from a container
            </ListGroupItem>
            <ListGroupItem>
              You must be able to move an item into another container for it to
              be removed from a container
            </ListGroupItem>
            <ListGroupItem>
              You may be allowed to add empty containers
            </ListGroupItem>
            <ListGroupItem>
              The game ends when there are no more viable moves OR you have
              properly matched all items in their containers
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
      <Row className="justify-content-center mt-2">
        <Col xs="auto">
          <Button variant="success" onClick={newGame}>
            New Game
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
