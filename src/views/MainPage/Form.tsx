import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form'

import { IRootStore } from '../../features/store';
import { setGameState, setStartOptions } from '../../features/main/slicer';
import { GameStatus } from '../../features/main/types';
import { IFieldSize } from '../../features/field/types';

interface IFormInterface {
  size: IFieldSize,
  minesCount: number,
}

const StartForm = () => {
  const storageValues = useSelector((state: IRootStore) => state.main);
  const dispatch = useDispatch();

  const onSubmit = (values: IFormInterface) => {
    dispatch(setStartOptions(values.minesCount, {x: values.size.x, y: values.size.y}));
    dispatch(setGameState(GameStatus.GAME_GENERATE_MAP));
  }

  return (
    <Form 
      onSubmit={onSubmit}
      initialValues={storageValues}
      render={({handleSubmit, form, submitting, pristine, values}) => (
        <form onSubmit={handleSubmit}>
          <div className="main-page container">
            <div className="d-flex">
              <div className="p-2 flex-fill justify-content-center">
                <label>
                  <Field 
                    name="size.x"
                    className="number-input"
                    component="input"
                    type="number"
                  />
                  <p>Field size x</p>
                </label>
              </div>
              <div className="p-2 flex-fill justify-content-center">
                <label>
                  <Field 
                    name="size.y"
                    className="number-input"
                    component="input"
                    type="number"
                  />
                  <p>Field size y</p>
                </label>
              </div>
              <div className="p-2 flex-fill justify-content-center">
                <label>
                  <Field 
                    name="minesCount"
                    className="number-input"
                    component="input"
                    type="number"
                  />
                  <p>Mines</p>
                </label>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="d-inline-flex p-2">
              <button disabled={submitting}>Start game</button>
            </div>
          </div>
        </form>
      )}
    />
  );
}

export default StartForm;