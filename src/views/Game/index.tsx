import React, { useState } from 'react';
import Field   from './Field';
import { useSelector } from 'react-redux';
import { IRootStore } from '../../features/store';
import { GameStatus } from '../../features/main/types';

const Game = () => {
  const gameStatus = useSelector((state: IRootStore) => state.main.gameStatus)

  let popupContent;
  if (gameStatus === GameStatus.LOOSE_SCREEN) {
    popupContent = (<div className="popup loose">You are loose</div>)
  } else if (gameStatus === GameStatus.WIN_SCREEN) {
    popupContent = (<div className="popup win">You are win!</div>)
  }

  return (
    <React.Fragment>
      {popupContent}
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