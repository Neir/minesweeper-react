import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    hint: number;
    onclick: Function;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
    warning: '⚠️',
};

const cellStyle = (status: CellStatus): React.CSSProperties => ({
    backgroundColor:
        status === 'untouched' || status === 'flagged' ? '#ccc' : undefined,
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.status)}
            className={`cell ${props.hint > 0 ? 'hint' : ''}`}
        >
            { props.hint > 0 ?  props.hint : emojis[props.status] }
        </div>
    );
};
