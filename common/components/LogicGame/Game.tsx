import React, { useEffect } from "react";
import { useLogicGameContext } from "./context";
import ItemContainer from "./ItemContainer";
import { Card, Row, Button, Col } from "react-bootstrap";

// This is the main game component, it will house the logic for the game
const Game: React.FC = () => {
  const { newGame, containers, containersRemaining, addContainer } =
    useLogicGameContext();

  const maxContainers = containersRemaining === 0;

  useEffect(() => {
    newGame();
  }, []);

  return (
    <Col xl={6} lg={9} xs={12}>
      <Card>
        <Card.Header>
          <Row className="justify-content-center">
            <Col xs="auto">
              <Card.Title>Logic Game</Card.Title>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className="justify-content-center pt-2">
            {containers.map((item, indx) => {
              return <ItemContainer key={indx} {...item} />;
            })}
          </Row>
          <Row className="justify-content-center mt-2">
            <Col xs="auto">
              <Button disabled={maxContainers} onClick={addContainer}>
                {maxContainers
                  ? "All containers used"
                  : `Add Container (${containersRemaining} remaining)`}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Game;
