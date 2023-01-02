import React from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';

export default function Menu() {
  return (
    <Container>
        <Row className="justify-content-center">
            <Col xs="auto">
            <h1>Sudoku</h1>
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col md={6}>
                <p className="text-center">Welcome to Sudoku, the numeric puzzle game. Sudoku is played by filling in all empty cells in a sudoku grid so that each row, column, and 3x3 grid includes all unique numbers 1-9. Choose one of the variants below to begin solving puzzles.</p>
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col xs="auto">
                <Button variant="primary" href="/games/sudoku/classic">Classic Sudoku</Button>
            </Col>
        </Row>
        <Row className="justify-content-center mt-2">
            <Col xs="auto">
                <Button variant="danger" href="/games/sudoku/speed">Speed Sudoku</Button>
            </Col>
        </Row>
    </Container>
  )
}
