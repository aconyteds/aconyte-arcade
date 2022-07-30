import React from "react";
import Game from "./Game";
import Menu from "./Menu";
import { Container } from "react-bootstrap";
import { WordGameContext, WordGameContextProvider } from "./context";

export default function WordGame() {
  return (
    <WordGameContextProvider>
      <WordGameContext.Consumer>
        {({ inGame }) => (
          <Container className="h-100 overflow-auto">
            {inGame ? <Game /> : <Menu />}
          </Container>
        )}
      </WordGameContext.Consumer>
    </WordGameContextProvider>
  );
}
