import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IRootStore } from '../features/store';
import { GameStatus } from '../features/main/types';

import MainPage from './MainPage';
import Game from './Game';

import { generateMap } from '../features/field/action';
import { setGameState } from '../features/main/slicer';


const App = () => {
  const dispath = useDispatch();
  const {gameStatus, size, minesCount} = useSelector((state: IRootStore) => state.main);

  useEffect(() => {
    const asyncAction = async () => {
      if (gameStatus === GameStatus.GAME_GENERATE_MAP) {
        await dispath(generateMap({
          minesCount,
          size
        }));

        dispath(setGameState(GameStatus.GAME_BEFORE_START));
      }
    }

    asyncAction();
  });

  switch(gameStatus) {
    case GameStatus.MAIN_SCREEN:
      return <MainPage />

    case GameStatus.GAME_GENERATE_MAP:
      return <React.Fragment />;

    case GameStatus.GAME_BEFORE_START:
    case GameStatus.GAME_IN_PROCESS:
    case GameStatus.WIN_SCREEN:
    case GameStatus.LOOSE_SCREEN:
      return <Game />
  }
}

export default App;