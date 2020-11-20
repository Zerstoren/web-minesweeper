import React, { useEffect, useState } from 'react';
import Field   from './Field';
import { useDispatch, useSelector } from 'react-redux';
import { IRootStore } from '../../features/store';
import { GameStatus } from '../../features/main/types';
import Board from './Board';
import { setGameState } from '../../features/main/slicer';

const Game = () => {
  const dispatch = useDispatch();
  const gameStatus = useSelector((state: IRootStore) => state.main.gameStatus)
  const {isMineOpen, allMinesFound} = useSelector((state: IRootStore) => state.field);

  useEffect(() => {
    if (isMineOpen) {
      dispatch(setGameState(GameStatus.LOOSE_SCREEN));
    } else if (allMinesFound) {
      dispatch(setGameState(GameStatus.WIN_SCREEN));
    }
  });

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
        <Board />
        <Field />
      </div>
    </React.Fragment>
  )
}

export default Game;