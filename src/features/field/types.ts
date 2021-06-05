import { EntityId } from "@reduxjs/toolkit";

export type {
  IFieldStore,
  IFieldList,
  IFieldElement,
  IFieldCeil,
  IFieldSize,
  IOpenCellPayload
}

interface IOpenCellPayload {
  isMine: boolean,
  targetElement: IFieldElement,
  foundToOpen: Array<IFieldElement>
}

interface IFieldStore {
  ids: Array<EntityId>
  entities: IFieldList,
  allMinesFound: boolean,
  isMineOpen: boolean,
  minesLeft: number
}

interface IFieldList {
  [key: string]: IFieldCeil
}

interface IFieldElement {
  x: number,
  y: number,
}

interface IFieldCeil extends IFieldElement {
  isMine: boolean,
  isOpen: boolean,
  isFlagged: boolean,
  numberMinesAround: number
}

interface IFieldSize {
  x: number,
  y: number
}