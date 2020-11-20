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

  const validateForm = (values: IFormInterface) => {
    const errors: {
      size: {
        x?: string,
        y?: string
      }
      minesCount?: string
    } = {
      size: {}
    };

    if (!(3 <= values.size.x && values.size.x <= 30)) {
      errors.size.x = 'Generate map directly from 3 to 30 column';
    }

    if (!(3 <= values.size.y && values.size.y <= 30)) {
      errors.size.y = 'Generate map directly from 3 to 30 rows';
    }

    if (!errors.size.x && !errors.size.y) {
      let minMineCount = Math.round(values.size.x * values.size.y / 12);
      let maxMineCount = Math.round(values.size.x * values.size.y / 2);

      if (!(minMineCount <= values.minesCount && values.minesCount <= maxMineCount)) {
        errors.minesCount = `Set mines count in range from ${minMineCount} to ${maxMineCount}`
      }
    }

    return errors;
  }

  return (
    <Form 
      onSubmit={onSubmit}
      initialValues={storageValues}
      validate={validateForm}
      render={({handleSubmit, form, submitting, pristine, values}) => (
        <form onSubmit={handleSubmit}>
          <div className="main-page container">
            <div className="d-flex">
              <div className="p-2 flex-fill justify-content-center">
                <Field name="size.x">
                  {({input, meta}) => (
                    <label>
                      <input {...input} type="number" className="number-input" />
                      <p>Field size x</p>
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </label>
                  )}
                </Field>
              </div>
              <div className="p-2 flex-fill justify-content-center">
                <Field name="size.y">
                  {({input, meta}) => (
                    <label>
                      <input {...input} type="number" className="number-input" />
                      <p>Field size y</p>
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </label>
                  )}
                </Field>
              </div>
              <div className="p-2 flex-fill justify-content-center">
                <Field 
                  name="minesCount"
                  >
                    {({input, meta}) => (
                      <label>
                        <input {...input} type="number" className="number-input" />
                        <p>Mines</p>
                        {meta.error && meta.touched && <span>{meta.error}</span>}
                      </label>
                    )}
                </Field>
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