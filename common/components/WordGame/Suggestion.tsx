import React, { useContext, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useToggle } from '../../hooks';
import { WordGameContext } from './context';


export default function Suggestion() {
    const { suggestion } = useContext(WordGameContext);
    const [show, setShow] = useToggle(false);

    useEffect(() => {
        setShow(false);
    }, [suggestion]);

    const handleClick = () => {
        setShow(!show);
    }

    return (
        <Row className="justify-content-center cursor-pointer m-3" onClick={handleClick}>
            <Col xs="auto">
                <h3 className={show ? "revealo" : "obscurio"}>
                    <span>{suggestion.suggestion.toUpperCase()}</span>
                    <small className="text-muted ps-3">{suggestion.probability.toFixed(2)}%</small>
                </h3>
            </Col>
        </Row>
    )
}
