import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Difficulty } from '.';

interface MenuProps {
    handleDifficulty: (difficulty: Difficulty) => void;
}

export default function Menu({
    handleDifficulty
}: MenuProps) {
    return (
        <Row className="justify-content-center text-center">
            <Col xs="auto">
                <Row>
                    <Col>
                        <h1>Welcome to the W<span className="text-warning">o</span><span className="text-success">r</span>d Game</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Select a difficulty!</p>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-1">
                    <Col xs={6}>
                        <Button className="w-100" variant="success" size='lg' onClick={() => handleDifficulty("easy")}>Easy</Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-1">
                    <Col xs={6}>
                        <Button className="w-100" variant="warning" size='lg' onClick={() => handleDifficulty('medium')}>Medium</Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-1">
                    <Col xs={6}>
                        <Button className="w-100" variant="danger" size='lg' onClick={() => handleDifficulty('hard')}>Hard</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
