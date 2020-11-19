import React from 'react';
import Field   from './Field';

const Game = () => {
  return (
    <React.Fragment>
      <div className="board">
        <div className="board-score d-flex justify-content-between">
          <div className="board-minues-neded-found">000</div>
          <div className="board-restart">Smile</div>
          <div className="board-timer">000</div>
        </div>

        <Field />

      </div>
    </React.Fragment>
  )
}

export default Game;