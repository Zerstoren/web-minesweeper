import { createAsyncThunk } from '@reduxjs/toolkit';
import { IFieldCeil, IFieldElement, IFieldList, IFieldSize, IOpenCellPayload } from './types';

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

const isAllMinesFound = (entities: IFieldList) : boolean => {
  let closedItems = 0;
  let mines = 0;
  let minesFlagged = 0;
  let flags = 0;

  Object.values(entities).forEach((ceil: IFieldCeil) => {
    if (!ceil.isOpen) closedItems += 1;
    if (ceil.isMine) mines += 1;
    if (ceil.isMine && ceil.isFlagged) minesFlagged += 1;
    if (ceil.isFlagged) flags += 1;
  });

  return (mines === closedItems || mines === minesFlagged) && flags <= mines;
};

let maxLevel: number = 0;
//TODO need optimization. Too many recursion
const _searchElementForOpen = (
  element: IFieldElement, 
  size: IFieldSize, 
  entities: IFieldList, 
  foundElementList: Array<string> = [],
  level: number = 0
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
    }

    if (!ceil.isMine && !ceil.isOpen && !ceil.isFlagged) {
      foundElementList.push(elementId);
    }
  });
  
  searchNestedItems.length && searchNestedItems.forEach((nestedEl) => {
    foundElementList.concat(_searchElementForOpen(
      nestedEl,
      size,
      entities,
      foundElementList,
      level+1,
    ))
  });
  
  return foundElementList;
}

const searchElementForOpen = (
  element: IFieldElement, 
  size: IFieldSize, 
  entities: IFieldList,
) =>  _searchElementForOpen(element, size, entities, [], 0).map((elementNumber) => getElementFromString(elementNumber))


const openCeil = createAsyncThunk('field/openCeil', async (data: {
  entities: IFieldList,
  size: IFieldSize,
  element: IFieldElement,
}) => {
  const ceil = data.entities[getCeilString(data.element)];
  const result : IOpenCellPayload = {
    isMine: false,
    foundToOpen: [],
    targetElement: data.element
  };

  if (ceil.isMine) {
    result.isMine = true;
  };

  if (ceil.numberMinesArround === 0) {
    result.foundToOpen = searchElementForOpen(data.element, data.size, data.entities)
  }

  return result;
});

const generateMap = createAsyncThunk('field/generateMap', async (data: {minesCount: number, size: IFieldSize}) => {
  return generateFieldMap(data.minesCount, data.size);
});

export {
  generateMap,
  openCeil,
  getCeilString,
  searchElementForOpen,
  isAllMinesFound
};
