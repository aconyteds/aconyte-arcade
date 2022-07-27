import React, { useEffect, useMemo } from 'react';
import { useArray } from '../../hooks';
import { getSuggestions } from './utility';

interface CellProps {
    value: number;
    indx: number;
    locked: boolean;
    puzzle: number[];
    onChange: (newValue: number) => void;
};

export default function Cell({
    value,
    locked,
    indx,
    puzzle,
    onChange,
}: CellProps) {
    const { array: suggestions, set: setSuggestions } = useArray<number>([]);

    const updateSuggestions = async () => {
        if (!puzzle || locked) {
            setSuggestions([]);
            return;
        }
        const currSuggestions = await getSuggestions(puzzle, Math.floor(indx / 9), indx % 9);
        setSuggestions(currSuggestions);
    }

    useEffect(() => {
        updateSuggestions().catch(console.error);
    }, [puzzle]);

    const className = useMemo(() => {
        let name = "cell";
        if (locked) {
            name += " locked bg-dark text-white";
        }
        if (!locked && suggestions.length === 0) {
            name += " border-danger";
        }
        return name;
    }, [locked, suggestions]);

    const onClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (locked || suggestions.length === 0) {
            return;
        }
        if (value === 0) {
            onChange(suggestions[0]);
            return;
        }
        // get the next suggestion
        const index = suggestions.indexOf(value);
        if (index === -1) {
            // guard, should never happen
            onChange(suggestions[0]);
            return;
        } else if (index === suggestions.length - 1) {
            onChange(0);
            return;
        }
        onChange(suggestions[index + 1]);
    }

    return (
        <div className={className} onClick={onClick}>
            <span className={`cell-value${value === 0 ? ' no-value' : ''}`}>
                {value}
            </span>
            {locked ? null : <small className="candidates">{suggestions.join(" ")}</small>}
        </div>
    )
}
