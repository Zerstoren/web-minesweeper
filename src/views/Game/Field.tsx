import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IRootStore } from '../../features/store';
import { flagElement} from '../../features/field/slice';
import { getCeilString, openCeil } from '../../features/field/action';
import { GameStatus } from '../../features/main/types';
import { setGameState } from '../../features/main/slicer';
import { IFieldElement } from '../../features/field/types';


const Field = () => {
  const dispath = useDispatch();

  const [currentPress, setCurrentPress] = useState('');
  const [gameStart, setGameStart] = useState(false);
  const {size, gameStatus} = useSelector((state: IRootStore) => state.main);
  const field = useSelector((state: IRootStore) => state.field);

  useEffect(() => {
    const updateGame = () => {
      if (gameStatus === GameStatus.GAME_GENERATE_MAP && gameStart === true) {
        setGameStart(false);
      }
  
      if (gameStatus === GameStatus.GAME_BEFORE_START && gameStart) {
        dispath(setGameState(GameStatus.GAME_IN_PROCESS));
      }
    }

    updateGame();
  })

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement & { target: HTMLDivElement }>) => {
    if (gameStatus !== GameStatus.GAME_IN_PROCESS && gameStatus !== GameStatus.GAME_BEFORE_START) {
      return;
    }

    const target = e.target as HTMLDivElement;
    const ceilId = getCeilString({
      x: Number.parseInt(target.dataset.x as string), 
      y: Number.parseInt(target.dataset.y as string)
    });

    const ceil = field.entities[ceilId];

    if ((!ceil.isFlagged && e.button === 0) || e.button === 2) {
      setCurrentPress(ceilId);
    }
  }

  const onMouseLeave = () => {
    setCurrentPress('');
  }

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement & { target: HTMLDivElement }>) => {
    if (gameStatus !== GameStatus.GAME_IN_PROCESS && gameStatus !== GameStatus.GAME_BEFORE_START) {
      return;
    }

    const target = e.target as HTMLDivElement;
    const element: IFieldElement = {
      x: Number.parseInt(target.dataset.x as string), 
      y: Number.parseInt(target.dataset.y as string)
    };
    
    const ceilId = getCeilString(element);

    if (ceilId !== currentPress) {
      return;
    }

    const ceil = field.entities[ceilId];

    if (e.button === 0) {
      setGameStart(true);
      dispath(openCeil({
        entities: field.entities,
        element: element,
        size: size
      }));
    } else if (e.button === 2 && !ceil.isOpen) {
      setGameStart(true);
      dispath(flagElement(element));
    }

    setCurrentPress('');
  }

  let axisY = [];
  for (let y = 0; y < size.y; y++) {
    let axisX = [];
    for (let x = 0; x < size.x; x++) {
      let currentField = field.entities[getCeilString({x, y})];

      let isClassWhenMouseDownOnCurrentBox = getCeilString({x, y}) === currentPress || currentField.isOpen ? 'pressed' : ''; 
      let ceilContent = '';

      if (currentField.isFlagged) {
        ceilContent = 'F';
      } else if (currentField.isOpen) {
        if (currentField.isMine) {
          ceilContent = 'M';
        } else if (currentField.numberMinesArround) {
          ceilContent = currentField.numberMinesArround.toString();
        }
      }

      axisX.push(
        <div 
          className={`column ${isClassWhenMouseDownOnCurrentBox}`} 
          key={getCeilString({x, y})}
          data-x={x} 
          data-y={y}
          draggable="false"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >{ceilContent}</div>
      );
    }

    axisY.push(
      <div 
        className="row d-flex justify-content-center"
        draggable="false"
        key={y}
      >
        {axisX}
      </div>
    )
  } 

  return (
    <div className="field" draggable="false" onContextMenu={(e) => {e.preventDefault(); return false;}}>
      {axisY}
    </div>
  );
}

export default Field;