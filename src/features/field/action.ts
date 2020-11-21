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

//TODO need optimization. Too many recursion
const _searchElementForOpen = (
  element: IFieldElement, 
  size: IFieldSize, 
  entities: IFieldList,
  found: Array<string>
) => {
  const canOpenPoint = (x: number, y: number) => {
    const positionElement: IFieldElement = {x, y};

    if (!getCoordinateInField(positionElement, size)) {
      return 'f';
    }

    const elementId = getCeilString(positionElement);
    const ceil: IFieldCeil = entities[elementId];

    if (found.includes(elementId)) {
      return 'f';
    }

    if (ceil.isFlagged || ceil.isMine) {
      return 'f';
    }

    if (ceil.numberMinesArround) {
      return 'l';
    }

    return 'o'
  }

  let spanLeft: number;
  let spanRight: number;

  let stack = [getCeilString(element)];
  let i = 0;

  while(stack.length != 0) {
    i++;
    let point = getElementFromString(stack[0]);
    stack.splice(0, 1);

    let y1 = point.y;
    let newpoint = {x: 0, y: 0};
    spanLeft = 0;
    spanRight = 0;

    while(y1 > 0) {
      let g = canOpenPoint(point.x, y1);
      if (g === 'o') {
        y1 = y1 - 1;
      } else if (g === 'l') {
        // y1 = y1 - 1;
        break;
      } else {
        break;
      }
    }

    while(y1 < size.y) {
      let b = canOpenPoint(point.x, y1);
      if (b === 'f') {break;}
      
      found.push(getCeilString({x: point.x, y: y1}));
      let cl = entities[getCeilString({x: point.x, y: y1})];
      if (cl.numberMinesArround) {
        y1 = y1 + 1;
        continue;
      }

      if (spanLeft == 0 && point.x > 0 && canOpenPoint(point.x-1,y1) != 'f') {
        newpoint.x = point.x-1; 
        newpoint.y = y1; 
        stack.push(getCeilString(newpoint));
        spanLeft = 1;
      } else if (spanLeft == 1 && point.x > 0 && canOpenPoint(point.x-1,y1) == 'f') {
          spanLeft = 0;
      }
      
      if (spanRight == 0 && point.x < size.x && canOpenPoint(point.x+1,y1) != 'f') {
        newpoint.x = point.x+1; 
        newpoint.y = y1; 
        stack.push(getCeilString(newpoint));
        spanRight = 1;
      } else if (spanRight == 1 && point.x < size.x && canOpenPoint(point.x+1,y1) == 'f') {
        spanRight = 0;
      }

      y1 = y1 + 1;
    }
  }
  // positionsArround.forEach((modifier) => {
  //   const [y, x] = modifier;
  //   const positionElement: IFieldElement = {
  //     x: element.x + x,
  //     y: element.y + y
  //   }

  //   if (!getCoordinateInField(positionElement, size)) {
  //     return;
  //   }
  //   const elementId = getCeilString(positionElement);

  //   const ceil: IFieldCeil = entities[elementId];
    
  //   if (!ceil.isOpen && !ceil.isFlagged && ceil.numberMinesArround === 0 && !foundElementList.includes(elementId)) {
  //     searchNestedItems.push(positionElement);
  //   }

  //   if (!ceil.isMine && !ceil.isOpen && !ceil.isFlagged) {
  //     foundElementList.push(elementId);
  //   }
  // });
  
  // searchNestedItems.length && searchNestedItems.forEach((nestedEl) => {
  //   foundElementList.concat(_searchElementForOpen(
  //     nestedEl,
  //     size,
  //     entities,
  //     foundElementList,
  //     level+1,
  //   ))
  // });
}

const searchElementForOpen = (
  element: IFieldElement, 
  size: IFieldSize, 
  entities: IFieldList,
) => {
  let fills: Array<string> = [];
   _searchElementForOpen(element, size, entities, fills)//.map((elementNumber) => getElementFromString(elementNumber))
   return fills.map((elementStr) => getElementFromString(elementStr))
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
