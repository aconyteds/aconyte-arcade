import React from "react";
import { useLogicGameContext } from "./context";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CountdownButton from "../CountdownButton";

export const ScoreScreen = () => {
  const { newGame, gameTime, won, containersRemaining } = useLogicGameContext();

  return (
    <Container className="pt-2">
      <Row className="justify-content-center">
        <Col xs="auto">
          <Card className="border border-primary border-1 rounded-4">
            <Card.Header className="p-3">
              <Card.Title>
                <h2 className="text-center">Game Over!</h2>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row className="justify-content-center">
                <Col xs="auto">
                  {won ? (
                    <Card.Text className="text-success">
                      You finished in {gameTime}.{" "}
                      {containersRemaining > 0
                        ? `You still had ${containersRemaining} container${
                            containersRemaining > 1 ? "s" : ""
                          } remaining.`
                        : "It took every container."}
                    </Card.Text>
                  ) : (
                    <Card.Text className="text-danger">
                      No More Moves!
                    </Card.Text>
                  )}
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <Row className="justify-content-center mt-2">
                <Col xs="auto">
                  <CountdownButton
                    onClick={newGame}
                    speed={1000}
                    timeLimit={10000}
                  >
                    Play Again
                  </CountdownButton>
                </Col>
                <Col xs="auto" className="offset-xs-1">
                  <Button href="/games/logicGame" className="btn-secondary">
                    Main Menu
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
