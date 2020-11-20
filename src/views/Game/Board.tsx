import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameStatus } from '../../features/main/types';
import { IRootStore } from '../../features/store';

const Board = () => {
  const [timer, setTimer] = useState(0);
  const gameStatus = useSelector((store: IRootStore) => store.main.gameStatus);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (gameStatus === GameStatus.GAME_IN_PROCESS) {
      timerInterval = setInterval(() => setTimer(timer + 1), 1000);
    }

    return () => {
      clearInterval(timerInterval);
    }
  });

  return (
    <div className="board-score d-flex justify-content-between">
      <div className="board-minues-neded-found">000</div>
      <div className="board-restart">Smile</div>
      <div className="board-timer">{timer}</div>
    </div>
  )
}

export default Board;