import type { NextPage } from "next";
import { Row, Col, Container, Card } from "react-bootstrap";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const launchSudoku = () => {
    router.push("/games/sudoku");
  };

  const launchWordGame = () => {
    router.push("/games/wordGame");
  };

  const launchLogicGame = () => {
    router.push("/games/logicGame");
  };

  return (
    <Container fluid className="overflow-auto">
      <Row className="justify-content-center">
        <Col xs={12} lg={8}>
          <Row className="justify-content-center">
            <Col xs="auto">
              <h1>Aconyte&rsquo;s Arcade</h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto">
              <p>
                Welcome to Aconyte&rsquo;s Arcade! Please enjoy your time
                purusing the games below.
              </p>
            </Col>
          </Row>
          <Row xs={1} md={2} className="g-4 justify-content-center">
            <Col>
              <Card onClick={launchSudoku} className="cursor-pointer shadow">
                <Card.Header>
                  <Card.Img variant="top" src="/sudoku.png" />
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    <h3 className="text-center">Sudoku</h3>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted text-center">
                    A Number finding game where you need to follow 3 rules.
                  </Card.Subtitle>
                  <ol>
                    <li>No duplicates in a row</li>
                    <li>No duplicates in a column</li>
                    <li>No duplicates in each 3x3 box</li>
                  </ol>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card onClick={launchWordGame} className="cursor-pointer shadow">
                <Card.Header>
                  <Card.Img variant="top" src="/wordGame.png" />
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    <h3 className="text-center">Word Game</h3>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted text-center">
                    A word guessing game which slowly reveals the hidden word.
                  </Card.Subtitle>
                  <ol>
                    <li>
                      <span className="text-success">Green</span> background
                      means the character is in the correct place.
                    </li>
                    <li>
                      <span className="text-warning">Yellow</span> background
                      means the character is in the word, but not the right
                      place.
                    </li>
                    <li>
                      <span style={{ textDecoration: "underline" }}>
                        Underlined
                      </span>{" "}
                      text means the letter occurs more than once in the word.
                    </li>
                  </ol>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card onClick={launchLogicGame} className="cursor-pointer shadow">
                <Card.Header>
                  <Card.Img variant="top" src="/LogicGame.png" />
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    <h3 className="text-center">Logic Game</h3>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted text-center">
                    A symbol matching game where you need to match them all to
                    win.
                  </Card.Subtitle>
                  <ol>
                    <li>
                      Symbols must be placed on top of the same symbol or into
                      an empty container.
                    </li>
                    <li>
                      You have a limited number of empty containers to use.
                    </li>
                    <li>You must match all symbols to win.</li>
                  </ol>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
