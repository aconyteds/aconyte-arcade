import React from 'react';
import { Col } from 'react-bootstrap';
import { Feedback } from './context';

export default function Character({
    letter,
    in_word,
    in_correct_location,
    possible_double
}: Feedback) {

    const className = in_correct_location ? "bg-success text-white" : in_word ? "bg-warning text-white" : "bg-danger";

    return (
        <Col xs="auto" className={`border border-1 ${className}`}><span style={{
            height: "40px",
            width: "40px",
            fontSize: "24px",
            display: "inline-block",
            textAlign: "center",
            verticalAlign: "middle",
            textDecoration: possible_double ? "underline" : "none"
        }}>{letter.toUpperCase()}</span></Col>
    )
}
