import React, { useEffect, useMemo } from 'react';
import { useArray, useToggle } from '../../hooks';
import { Row, Col, Button } from 'react-bootstrap';
import { generateSudoku, validatePuzzle, solveSudoku } from "./utility";
import Puzzle from "./Puzzle";

export default function Sudoku() {
    const { array: puzzle, set: setPuzzle } = useArray<number>([]);
    const { array: progress, set: setProgress } = useArray<number>([]);
    const [playing, setPlaying] = useToggle(true);
    const [victory, setVictory] = useToggle(false);


    const generatePuzzle = async () => {
        const puzzle = await generateSudoku();
        setPuzzle(puzzle);
    };

    const newPuzzle = () => {
        generatePuzzle().catch(console.error);
        setPlaying(true);
    };

    useEffect(() => {
        newPuzzle();
    }, []);

    const resetPuzzle = () => {
        setPuzzle([...puzzle]);
    }

    const updateProgress = (board: number[]) => {
        setProgress(board);
    };

    const readyToSubmit = useMemo(() => {
        return progress.every((cell) => cell !== 0);
    }, [progress]);


    const submitPuzzle = async () => {
        setVictory(await validatePuzzle(progress));
        setPlaying(false);
    };

    const solvePuzzle = async () => {
        const solution = await solveSudoku(puzzle);
        if (solution) {
            setPuzzle(solution);
        }
        setVictory(!!solution);
        setPlaying(false);
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1>Sudoku</h1>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <div className={`sudoku-puzzle${victory ? " border-success" : ''}`}>
                        <Puzzle puzzle={puzzle} updateProgress={updateProgress} />
                    </div>
                </Col>
            </Row>
            {!playing ? <Row className="justify-content-center m-2">
                <Col xs="auto">
                    <h1 className={victory ? "text-success" : "text-danger"}>{victory ? "You Win!" : "Incorrect Solution"}</h1>
                </Col>
            </Row> : null}
            <Row className="justify-content-center mt-2">
                {playing ? <>
                    <Col xs="auto">
                        <Button onClick={resetPuzzle}>Reset Puzzle</Button>
                    </Col>
                    <Col xs="auto">
                        <Button disabled={!readyToSubmit} onClick={submitPuzzle}>Submit Puzzle</Button>
                    </Col>
                    <Col xs="auto">
                        <Button variant="success" onClick={solvePuzzle}>Solve Puzzle</Button>
                    </Col>
                </> : <Col xs="auto">
                    <Button variant="success" onClick={newPuzzle}>New Puzzle</Button>
                </Col>}
            </Row>
        </>
    )
}
