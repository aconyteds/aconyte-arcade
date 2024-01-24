import React, { useEffect } from "react";
import Game from "./Game";
import Menu from "./Menu";
import { Container } from "react-bootstrap";
import { WordGameContext, WordGameContextProvider } from "./context";
import init, { InitOutput } from "../../WASM/wordGame/rust_word_game";
import { Loader } from "../Loader";

let wordGameEngine!: InitOutput;
/**
 *
 * Method to initialize the WASM module, this allows us to only load the WASM module once
 *
 * @returns Promise<InitOutput> - The WASM module
 */
const initializeWordGameEngine = async (): Promise<InitOutput> => {
  if (wordGameEngine) {
    return wordGameEngine;
  }
  const module = await init();
  wordGameEngine = module;
  return module;
};

export default function WordGame() {
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);

  useEffect(() => {
    initializeWordGameEngine().then(() => {
      setIsInitialized(true);
    });
  }, []);
  return isInitialized ? (
    <WordGameContextProvider>
      <WordGameContext.Consumer>
        {({ inGame }) => (
          <Container className="h-100 overflow-auto">
            {inGame ? <Game /> : <Menu />}
          </Container>
        )}
      </WordGameContext.Consumer>
    </WordGameContextProvider>
  ) : (
    <Loader />
  );
}
