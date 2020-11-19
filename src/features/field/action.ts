import {IFieldElement, IFieldCeil, IFieldSize} from './types';

const getRandomInt = (min: number, max: number) : number => Math.floor(Math.random() * (max - min + 1)) + min;;
const getMapPositionByNumber = (integerPosition: number, size: {x: number, y: number}) => {

}

const getRandomMinesPositions = (minesCount: number, size: IFieldSize) : Array<number> => {
  let minePosition: Array<number> = [];
  let currentRandomInt: number;

  if (minesCount >= size.y * size.x) {
    throw new Error('To many mines, where is validation?');
  }

  while(minesCount !== 0) {
    currentRandomInt = getRandomInt(0, (size.x * size.y) - 1);

    if (!minePosition.includes(currentRandomInt)) {
      minePosition.push(currentRandomInt);
      minesCount -= 1;
    }
  }

  return minePosition;
}


const generateFieldMap = (minesCount: number, size: IFieldSize) : Array<IFieldCeil> => {
  const mines = getRandomMinesPositions(minesCount, size);
  
  const mapCeilList: Array<IFieldCeil> = [];

  // for (let y = 0; y > size.y; y++) {
  //   for (let x = 0; x > size.x; x++) {

  //   }
  // }

  
  return [];
}

export {
  generateFieldMap
}