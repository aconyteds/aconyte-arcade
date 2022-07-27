import type { NextPage } from 'next';
import { Row, Col, Container } from 'react-bootstrap';
import Sudoku from '../../common/components/Sudoku';

const Home: NextPage = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Sudoku />
                </Col>
            </Row>
        </Container>
    )
}

export default Home
