import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameState } from '../../features/main/slicer';
import { GameStatus } from '../../features/main/types';
import { IRootStore } from '../../features/store';
import { useInterval } from '../../helpers/useInterval';

const Board = () => {
  const dispatch = useDispatch();
  const gameStatus = useSelector((store: IRootStore) => store.main.gameStatus);
  const [gameTimer, setGameTimer] = useState(0);

  const gameReset = () => {
    dispatch(setGameState(GameStatus.GAME_GENERATE_MAP));
  }

  useInterval(
    () => setGameTimer(gameTimer + 1),
    gameStatus === GameStatus.GAME_IN_PROCESS ? 1000 : null
  );

  if (gameStatus === GameStatus.GAME_BEFORE_START && gameTimer !== 0) {
    setGameTimer(0);
  }

  return (
    <div className="board-score d-flex justify-content-between">
      <div className="board-minues-neded-found">000</div>
      <div className="board-restart" onClick={gameReset}>Smile</div>
      <div className="board-timer" onClick={() => setGameTimer(gameTimer + 1)}>{gameTimer}</div>
    </div>
  );
}

export default Board;