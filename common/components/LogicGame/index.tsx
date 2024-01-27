import React from "react";
import Menu from "./Menu";
import { LogicGameContext, LogicGameContextProvider } from "./context";
import Game from "./Game";
import { Container, Row } from "react-bootstrap";

const LogicGame = () => {
  return (
    <LogicGameContextProvider>
      <LogicGameContext.Consumer>
        {({ inGame }) => (
          <Container fluid className="h-100 overflow-auto">
            <Row className="h-100 justify-content-center align-items-center">
              {inGame ? <Game /> : <Menu />}
            </Row>
          </Container>
        )}
      </LogicGameContext.Consumer>
    </LogicGameContextProvider>
  );
};

export default LogicGame;
