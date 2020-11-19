import { EntityId } from "@reduxjs/toolkit";

export type {
  IFieldStore,
  IFieldList,
  IFieldElement,
  IFieldCeil,
}

interface IFieldStore {
  ids: Array<EntityId>
  entities: IFieldList,
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
  numberMinesArround?: number
}
