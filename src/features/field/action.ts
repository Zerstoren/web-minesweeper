import {IFieldElement} from './types';

const getRandomInt = (min: number, max: number) : number => Math.floor(Math.random() * (max - min + 1)) + min;;


const getRandomMinesPositions = (sizeX: number, sizeY: number, minesCount: number) : Array<number> => {
  let minePosition: Array<number> = [];
  let currentRandomInt: number;

  if (minesCount >= sizeY * sizeX) {
    throw new Error('To many mines, where is validation?');
  }

  while(minesCount !== 0) {
    currentRandomInt = getRandomInt(0, (sizeX * sizeY) - 1);

    if (!minePosition.includes(currentRandomInt)) {
      minePosition.push(currentRandomInt);
      minesCount -= 1;
    }
  }

  return minePosition;
}


const generateFieldMap = (sizeX: number, sizeY: number, minesCount: number) : Array<IFieldElement> => {
  const mines = getRandomMinesPositions(sizeX, sizeY, minesCount);
  
  
  return [];
}

export {
  generateFieldMap
}