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

const searchElementForOpen = (
  element: IFieldElement, 
  size: IFieldSize, 
  entities: IFieldList,
) => {
  const canOpenPoint = (x: number, y: number) => {
    const positionElement: IFieldElement = {x, y};

    if (!getCoordinateInField(positionElement, size)) {
      return false;
    }

    const elementId = getCeilString(positionElement);
    const ceil: IFieldCeil = entities[elementId];

    if (found.includes(elementId) || stack.includes(elementId)) {
      return false;
    }

    if (ceil.isFlagged || ceil.isMine) {
      return false;
    }
    
    return true;
  }

  let found: Array<string> = [];
  let stack = [getCeilString(element)];
  
  while(stack.length !== 0) {
    let point = getElementFromString(stack[0]);
    found.push(stack[0])
    let ceil = entities[stack[0]]; 
    stack.splice(0, 1);

    if (ceil.numberMinesArround) {
      continue;
    }
    
    positionsArround.forEach((modifier) => {
      const [y, x] = modifier;
      const newpoint: IFieldElement = {
        x: point.x + x,
        y: point.y + y
      };

      if (canOpenPoint(newpoint.x, newpoint.y)) {
        stack.push(getCeilString(newpoint));
      }
    });
  }

  return found.map((elementStr) => getElementFromString(elementStr));
}


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
