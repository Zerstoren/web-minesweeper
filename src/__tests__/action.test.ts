import jest from 'jest';
import {searchElementForOpen} from '../features/field/action';
import entities from './data/entitiesFieldData';

test('search recursive open', () => {
  console.time('start search');
  let r = searchElementForOpen({x: 0, y: 0}, {x: 80, y: 80}, entities());
  console.timeEnd('start search');

  expect(r.length).toEqual(80*80-1);
  expect(4).toEqual(4);
});