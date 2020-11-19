import React from 'react';
import { useSelector } from 'react-redux';

import { IRootStore } from '../features/store';
import { GameStatus } from '../features/main/types';

import MainPage from './MainPage';
import Game from './Game';


const App = () => {
  const gameStatus = useSelector((state: IRootStore) => state.main.gameStatus);
  let gameScreen = null;

  switch(gameStatus) {
    case GameStatus.MAIN_SCREEN:
      gameScreen = <MainPage />
      break;

    case GameStatus.GAME_BEFORE_START:
    case GameStatus.GAME_IN_PROCESS:
    case GameStatus.WIN_SCREEN:
    case GameStatus.LOOSE_SCREEN:
      gameScreen = <Game />
      break;
  }

  return gameScreen;
}

export default App;