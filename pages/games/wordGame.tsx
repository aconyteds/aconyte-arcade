import type { NextPage } from 'next';
import { Row, Col, Container } from 'react-bootstrap';
import WordGame from '../../common/components/WordGame';

const Home: NextPage = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <WordGame />
                </Col>
            </Row>
        </Container>
    )
}

export default Home