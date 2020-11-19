import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IRootStore } from '../features/store';
import { GameStatus } from '../features/main/types';

import MainPage from './MainPage';
import Game from './Game';

import { generateMap } from '../features/field/slice';
import { setGameState } from '../features/main/slicer';


const App = () => {
  const dispath = useDispatch();
  const {gameStatus, size, minesCount} = useSelector((state: IRootStore) => state.main);
  
  let gameScreen = null;

  switch(gameStatus) {
    case GameStatus.MAIN_SCREEN:
      gameScreen = <MainPage />
      break;

    case GameStatus.GAME_GENERATE_MAP:
      dispath(generateMap(
        minesCount,
        size
      ));
      // Fix problem with render.
      //TODO try fix it normaly, maybe need async thunk and memo
      setTimeout(() => dispath(setGameState(GameStatus.GAME_BEFORE_START)));
      gameScreen = (<React.Fragment></React.Fragment>);
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