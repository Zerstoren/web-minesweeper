import {IFieldElement, IFieldCeil, IFieldSize, IFieldList, IFieldStore} from './types';
import { createAsyncThunk } from '@reduxjs/toolkit';

const positionsArround: Array<[number, number]> = [
  // [y, x]
  [-1, -1], [-1,  0], [-1,  1],
  [ 0, -1],           [ 0,  1],
  [ 1, -1], [ 1,  0], [ 1,  1],
]

const getRandomInt = (min: number, max: number) : number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const getCeilString = (ceil: IFieldElement) => 
  `${ceil.y}_${ceil.x}`;

const getElementFromString = (ceilId: string) : IFieldElement => {
  const [y, x] = ceilId.split('_');

  return {
    x: Number.parseInt(x),
    y: Number.parseInt(y),
  }
}

const getCoordinateInField = (element: IFieldElement, size: IFieldSize) : boolean => 
  (0 <= element.x && element.x <= size.x - 1) && (0 <= element.y && element.y <= size.y - 1)


const getMinesArroundPosition = (element: IFieldElement, size: IFieldSize, mines: Array<string>) : number => {
  let minesArround = 0;
  positionsArround.forEach((modifier) => {
    const [y, x] = modifier;
    const positionElement: IFieldElement = {
      x: element.x + x,
      y: element.y + y
    }

    if (!getCoordinateInField(positionElement, size)) {
      return;
    }

    if (mines.includes(getCeilString(positionElement))) {
      minesArround += 1;
    }
  });

  return minesArround;
}

const getRandomMinesPositions = (minesCount: number, size: IFieldSize) : Array<string> => {
  let minePosition: Array<string> = [];
  let currentRandomInt: number;

  if (minesCount >= size.y * size.x) {
    throw new Error('To many mines, where is validation?');
  }

  while(minesCount !== 0) {
    let currentRandomId = getCeilString({
      x: getRandomInt(0, size.x - 1),
      y: getRandomInt(0, size.y - 1),
    })

    if (!minePosition.includes(currentRandomId)) {
      minePosition.push(currentRandomId);
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
      let numberPosition = getCeilString({x, y});
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

const isAllMinesFound = (store: IFieldStore) : boolean => {
  let closedItems = 0;
  let mines = 0;
  Object.values(store.entities).forEach((ceil: IFieldCeil) => {
    if (!ceil.isOpen) closedItems += 1;
    if (ceil.isMine) mines += 1;
  });

  return mines === closedItems;
};

const searchElementForOpen = (
  element: IFieldElement, 
  size: IFieldSize, 
  entities: IFieldList,
) => {
  let debugNested: Array<IFieldElement> = [];
  let g = _searchElementForOpen(element, size, entities, [], 0, debugNested).map((elementNumber) => getElementFromString(elementNumber))
  console.log(debugNested.length);
  return g;
};

let maxLevel: number = 0;
//TODO need optimization. Too many recursion
const _searchElementForOpen = (
  element: IFieldElement, 
  size: IFieldSize, 
  entities: IFieldList, 
  foundElementList: Array<string> = [],
  level: number = 0,
  debugNested: Array<IFieldElement>
) => {
  if (level > maxLevel) {
    maxLevel = level;
  }

  if (level > 500) {
    // console.log('too nested')
    return [];
  }

  let searchNestedItems: Array<IFieldElement> = [];

  positionsArround.forEach((modifier) => {
    const [y, x] = modifier;
    const positionElement: IFieldElement = {
      x: element.x + x,
      y: element.y + y
    }

    if (!getCoordinateInField(positionElement, size)) {
      return;
    }
    const elementId = getCeilString(positionElement);

    const ceil: IFieldCeil = entities[elementId];
    
    
    if (!ceil.isOpen && !ceil.isFlagged && ceil.numberMinesArround === 0 && !foundElementList.includes(elementId)) {
      searchNestedItems.push(positionElement);
      debugNested.push(positionElement);
    }

    if (!ceil.isMine && !ceil.isOpen && !ceil.isFlagged) {
      foundElementList.push(elementId);
    }
  });
  
  searchNestedItems.length && searchNestedItems.map((nestedEl) => {
    foundElementList.concat(_searchElementForOpen(
      nestedEl,
      size,
      entities,
      foundElementList,
      level+1,
      debugNested,
    ))
  });
  
  if (level==0) {
    console.log(`max level ${maxLevel}`)
  }
  return foundElementList;
}


const generateMap = createAsyncThunk('field/generateMap', async (data: {minesCount: number, size: IFieldSize}) => {
  return generateFieldMap(data.minesCount, data.size);
});

export {
  generateMap,
  getCeilString,
  searchElementForOpen,
  isAllMinesFound
}