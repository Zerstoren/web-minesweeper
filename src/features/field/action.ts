import {IFieldElement, IFieldCeil, IFieldSize} from './types';

const positionsArround: Array<[number, number]> = [
  // [y, x]
  [-1, -1], [-1,  0], [-1,  1],
  [ 0, -1],           [ 0,  1],
  [ 1, -1], [ 1,  0], [ 1,  1],
]

const getRandomInt = (min: number, max: number) : number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const getNumberByMapPosition = (element: IFieldElement, size: IFieldSize) : number => 
  (size.y * element.y) + element.x;

const getMapPositionByNumber = (integerPosition: number, size: {x: number, y: number}) : IFieldElement => {
  return {x: 0, y: 0};
}

const getMinesArroundPosition = (element: IFieldElement, size: IFieldSize, mines: Array<number>) : number => {
  let minesArround = 0;
  positionsArround.forEach((modifier) => {
    const [y, x] = modifier;

    if (mines.includes(getNumberByMapPosition({
      x: element.x + x,
      y: element.y + y
    }, size))) {
      minesArround += 1;
    }
  });

  return minesArround;
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

  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      let numberPosition = getNumberByMapPosition({x, y}, size);
      let ceil: IFieldCeil = {
        x: x,
        y: y,
        isMine: mines.includes(numberPosition),
        isOpen: false,
        isFlagged: false,
        numberMinesArround: getMinesArroundPosition({x, y}, size, mines),
      }

      mapCeilList.push(ceil);
    }
  }

  
  return mapCeilList;
}

const openFieldElement = (ceil: IFieldCeil) => {
  
}

export {
  generateFieldMap,
  openFieldElement,
}