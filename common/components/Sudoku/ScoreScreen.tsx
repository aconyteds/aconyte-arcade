import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { formatTime, formatNumber } from "../../utilities";

export type ScoreScreenProps = {
  puzzleCount: number;
  totalGameTime: number;
  totalScore: number;
  playAgain: () => void;
};

const ScoreScreen: React.FC<ScoreScreenProps> = ({
  puzzleCount,
  totalGameTime,
  totalScore,
  playAgain,
}) => {
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
              <Card.Text>
                You completed{" "}
                {puzzleCount < 2 ? "the puzzle" : `${puzzleCount} puzzels`} in{" "}
                {formatTime(totalGameTime / 1000)}.
              </Card.Text>
              <Row>
                <Col>
                  <h2>Total Score: {formatNumber(totalScore)}</h2>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <Row className="justify-content-center mt-2">
                <Col xs="auto">
                  <Button onClick={playAgain} className="btn-success">
                    Play Again
                  </Button>
                </Col>
                <Col xs="auto" className="offset-xs-1">
                  <Button href="/games/sudoku" className="btn-secondary">
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

export default ScoreScreen;
