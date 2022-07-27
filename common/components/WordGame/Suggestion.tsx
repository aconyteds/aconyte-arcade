import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

interface SuggestionProps {
    suggestion: string;
}

export default function Suggestion({ suggestion }: SuggestionProps) {
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        setShow(false);
    }, [suggestion]);

    const handleClick = () => {
        setShow(!show);
    }

    return (
        <Row className="justify-content-center cursor-pointer" onClick={handleClick}>
            <Col xs="auto">
                <h3 className={show ? "revealo" : "obscurio"}><span >{suggestion?.toUpperCase()}</span></h3>
            </Col>
        </Row>
    )
}
