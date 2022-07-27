import type { NextPage } from 'next';
import { Row, Col, Container, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  const launchSudoku = () => {
    router.push('/games/sudoku');
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs="auto">
          <h1>Aconyte's Arcade</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <p>Welcome to Aconyte's Arcade! Please enjoy your time purusing the games below.</p>
        </Col>
      </Row>
      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card onClick={launchSudoku} className="cursor-pointer">
            <Card.Img variant="top" src="/sudoku.png" />
            <Card.Body>
              <Card.Title><h3 className="text-center">Sudoku</h3></Card.Title>
              <Card.Subtitle className="mb-2 text-muted text-center">A Number finding game where you need to follow 3 rules.</Card.Subtitle>
              <ol>
                <li>No duplicates in a row</li>
                <li>No duplicates in a column</li>
                <li>No duplicates in each 3x3 box</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
