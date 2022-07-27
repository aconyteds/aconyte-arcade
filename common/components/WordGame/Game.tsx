import React, { useState, useEffect, useMemo } from 'react';
import { Difficulty } from '.';
import { useArray } from '../../hooks';
import { Row, Col, Button } from 'react-bootstrap';
import Character from './Character';
import Suggestion from './Suggestion';

// Create an array of words length 5, no duplicates.
const WORDS = [
    "chair",
    "couch",
    "table",
    "flair",
    "flier",
    "steer",
    "stair",
    "staff",
    "stake",
    "steak",
    "peach",
    "pearl",
    "apple",
    "snail",
    "sneak",
    "snake",
    "flake",
    "shake",
];

interface GameProps {
    difficulty: Difficulty;
    returnToMenu: () => void;
}

export interface Feedback {
    character: string;
    inWord: boolean;
    correct: boolean;
    isPossibleDouble: boolean;
}

interface Guess {
    word: string;
    feedback: Feedback[];
}

export default function Game({
    difficulty,
    returnToMenu,
}: GameProps) {
    const [word, setWord] = useState<string>('');
    const [totalGuesses, setTotalGuesses] = useState<number>(0);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [suggestion, setSuggestion] = useState<string>('');
    const { array: guesses, push: addGuess, set: setGuesses } = useArray<Guess>([]);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    // method to retrieve a random word with a length specified
    const getRandomWord = () => {
        const randomIndex = Math.floor(Math.random() * WORDS.length);
        const randomWord = WORDS[randomIndex];
        return randomWord;
    };

    useEffect(() => {
        // initialize a guess count based on the current difficulty
        // easy = 10, medium = 7, hard = 5
        setTotalGuesses(difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5);
        // get a random word from the word bank
        setWord(getRandomWord());
    }, [gameOver]);

    // Method to take a submitted guess and determine if it is correct
    const handleGuess = () => {
        // if the game is over, do not accept any more guesses
        if (gameOver) {
            return;
        }
        // Check the letters in the guess against the letters in the word
        // If the letter is in the word, and the index matches, it is correct
        // If the letter is in the word, but the index does not match, it is inWord
        // If the letter is not in the word, it is not inWord
        const feedback: Feedback[] = currentGuess.split('').map((letter, indx) => {
            const isInWord = word.includes(letter);
            const isCorrect = isInWord && word.indexOf(letter) === indx;
            // Check if the letter is possibly a double
            const isDouble = word.split("").reduce((count, currLetter) => {
                if (letter === currLetter) {
                    return ++count;
                }
                return count;
            }, 0) > 1;
            return {
                character: letter,
                inWord: isInWord,
                correct: isCorrect,
                isPossibleDouble: isDouble
            };
        });
        // add the guess to the list of guesses
        addGuess({
            word: currentGuess,
            feedback,
        });
        setCurrentGuess('');
    };

    useEffect(() => {
        if (guesses.length === 0) {
            setGameOver(false);
            setWon(false);
            // random WORD
            setSuggestion(getRandomWord());
            return;
        }
        // create a suggestion from the guesses
        setSuggestion(getSuggestion());
        // if the word is guessed, set the game over to true
        if (word === guesses[guesses.length - 1].word) {
            setGameOver(true);
            setWon(true);
            return;
        }

        if (guesses.length > totalGuesses) {
            setGameOver(true);
            setWon(false);
            return;
        }
    }, [guesses]);

    const playAgain = () => {
        setGameOver(false);
        setWon(false);
        setGuesses([]);
        setCurrentGuess('');

    };

    const disableSubmit = useMemo(() => {
        return currentGuess.length < word.length || gameOver;
    }, [currentGuess, word]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    };

    const getSuggestion = (): string => {
        // Use the guesses to lookup the wordbank to identify a valid solution for the user
        const validAnswers = guesses.reduce((answers, guess): string[] => {
            let possibleAnswers = answers;
            guess.feedback.forEach((feedback, indx) => {
                if (feedback.correct) {
                    possibleAnswers = possibleAnswers.filter((answer) => answer[indx] === feedback.character);
                    return;
                }
                if (feedback.inWord) {
                    possibleAnswers = possibleAnswers.filter((answer) => answer.includes(feedback.character) && answer[indx] !== feedback.character);
                    return
                }
                possibleAnswers = possibleAnswers.filter((answer) => !answer.includes(feedback.character));
            });
            return possibleAnswers;
        }, [...WORDS]);
        return validAnswers[Math.floor(Math.random() * validAnswers.length)];
    }

    return (
        <>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <h1>Word Game</h1>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <p>Guess the {word.length} letter word!</p>
                        </Col>
                    </Row>
                    {
                        guesses.map((guess, index) => {
                            return (
                                <Row key={index} className="justify-content-center m-1">
                                    {guess.feedback.map((feedback, index) => {
                                        return (
                                            <Col xs="auto" key={index}>
                                                <Character
                                                    character={feedback.character}
                                                    inWord={feedback.inWord}
                                                    correct={feedback.correct}
                                                    isPossibleDouble={feedback.isPossibleDouble}
                                                />
                                            </Col>
                                        );
                                    })}
                                </Row>
                            )
                        })
                    }
                    {!gameOver ? <Suggestion suggestion={suggestion} /> : <></>}
                    <Row className="justify-content-center m-2">

                        {!gameOver ? (
                            <Col>
                                <input type="text" className="form-control" value={currentGuess} onChange={e => setCurrentGuess(e.target.value)} onKeyDown={handleKeyPress} maxLength={word.length} placeholder={`${word.length} character word`} />
                            </Col>
                        ) : (
                            <Col xs="auto"> {
                                won ? (
                                    <h2 className="text-success">You won!</h2>
                                ) : (
                                    <h2 className='text-danger'>You lost!</h2>
                                )
                            }
                            </Col>
                        )}

                    </Row>
                    <Row className="justify-content-center">
                        {!gameOver ? (
                            <Col xs="auto">
                                <Button variant="primary" disabled={disableSubmit} onClick={handleGuess}>Guess</Button>
                            </Col>) : (
                            <Col xs="auto">
                                <Button variant="primary" onClick={playAgain}>Play Again</Button>
                            </Col>
                        )
                        }
                        <Col xs="auto">
                            <Button variant="danger" onClick={returnToMenu}>Return to menu</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}
