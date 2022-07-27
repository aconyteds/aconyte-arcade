import React from 'react';
import { Col } from 'react-bootstrap';
import { Feedback } from './Game';

export default function Character({
    character,
    inWord,
    correct,
    isPossibleDouble
}: Feedback) {

    const className = correct ? "bg-success text-white" : inWord ? "bg-warning text-white" : "bg-danger";

    return (
        <Col xs="auto" className={`border border-1 ${className}`}><span style={{
            height: "40px",
            width: "40px",
            fontSize: "24px",
            display: "inline-block",
            textAlign: "center",
            verticalAlign: "middle",
            textDecoration: isPossibleDouble ? "underline" : "none"
        }}>{character.toUpperCase()}</span></Col>
    )
}
