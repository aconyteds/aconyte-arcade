import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";

export const Loader: React.FC = () => {
  return (
    <Container className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs="auto">
          <Spinner animation="border" variant="primary" />
        </Col>
      </Row>
    </Container>
  );
};
