import React, { useEffect, useMemo } from "react";
import { useLogicGameContext } from "./context";
import ItemContainer from "./ItemContainer";
import { Card, Row, Button, Col, CardFooter } from "react-bootstrap";
import { ScoreScreen } from "./ScoreScreen";

// This is the main game component, it will house the logic for the game
const Game: React.FC = () => {
  const {
    newGame,
    gameOver,
    inGame,
    containers,
    containersRemaining,
    addContainer,
  } = useLogicGameContext();

  const maxContainers = containersRemaining === 0;

  useEffect(() => {
    newGame();
  }, [inGame]);

  const buttonVariant = useMemo(() => {
    if (maxContainers) {
      return "danger";
    }
    if (containersRemaining === 2) {
      return "info";
    }
    if (containersRemaining === 1) {
      return "warning";
    }
    return "primary";
  }, [containersRemaining]);

  return (
    <Col xl={6} lg={9} xs={12}>
      {gameOver ? (
        <ScoreScreen />
      ) : (
        <Card>
          <Card.Header>
            <Row className="justify-content-between">
              <Col xs="auto">
                <Card.Title as="h3">Logic Game</Card.Title>
              </Col>
              <Col xs="auto">
                <Button href="/games/logicGame" variant="danger">
                  Main Menu
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="justify-content-center pt-2">
              {containers.map((item, indx) => {
                return <ItemContainer key={indx} {...item} />;
              })}
            </Row>
          </Card.Body>
          <CardFooter>
            <Row className="justify-content-center gap-2">
              <Col xs="auto">
                <Button
                  disabled={maxContainers}
                  onClick={addContainer}
                  variant={buttonVariant}
                >
                  {maxContainers
                    ? "All containers used"
                    : `Add Container (${containersRemaining} remaining)`}
                </Button>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      )}
    </Col>
  );
};

export default Game;
