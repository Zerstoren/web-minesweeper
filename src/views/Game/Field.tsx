import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IRootStore } from '../../features/store';
import { openElement, generateMap} from '../../features/field/slice';
import { GameStatus } from '../../features/main/types';

const Field = () => {
  const dispath = useDispatch();

  const [currentPress, setCurrentPress] = useState('');
  const {size, gameStatus, minesCount} = useSelector((state: IRootStore) => state.main);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement & { target: HTMLDivElement }>) => {
    const target = e.target as HTMLDivElement;
    setCurrentPress(`${target.dataset.x}_${target.dataset.y}`);
  }

  const onMouseLeave = () => {
    setCurrentPress('');
  }

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement & { target: HTMLDivElement }>) => {
    const target = e.target as HTMLDivElement;
    if (`${target.dataset.x}_${target.dataset.y}` === currentPress) {
      dispath(openElement({
        x: Number.parseInt(target.dataset.x as string),
        y: Number.parseInt(target.dataset.y as string)
      }));
    }

    setCurrentPress('');
  }

  if (gameStatus === GameStatus.GAME_BEFORE_START) {
    dispath(generateMap(
      minesCount,
      size
    ));
  }

  let axisY = [];
  for (let y = 0; y < size.y; y++) {
    let axisX = [];
    for (let x = 0; x < size.x; x++) {
      let isClassWhenMouseDownOnCurrentBox = `${x}_${y}` === currentPress ? 'pressed' : '';

      axisX.push(
        <div 
          className={`column ${isClassWhenMouseDownOnCurrentBox}`} 
          key={x + '_' + y}
          data-x={x} 
          data-y={y}
          draggable="false"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        ></div>
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
    <div className="field" draggable="false">
      {axisY}
    </div>
  )
}

export default Field;