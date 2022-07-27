import React, { useState } from 'react';
import Game from './Game';
import Menu from './Menu';
import { Container } from 'react-bootstrap';

// Create a Word game which takes in a word and a number of guesses.
// The word should be displayed in a hidden state.
// The user should be able to guess letters and see if they are in the word.
// The user should be able to see how many guesses they have left.
// The user should be able to see if they have won or lost.

export type Difficulty = 'easy' | 'medium' | 'hard';

export default function WordGame() {
    const [inGame, setInGame] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');

    const updateDificculty = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        setInGame(true);
    };

    const returnToMenu = () => {
        setInGame(false);
    };

    return (
        <Container>
            {inGame ? <Game difficulty={difficulty} returnToMenu={returnToMenu} /> : <Menu handleDifficulty={updateDificculty} />}
        </Container>

    );
}
