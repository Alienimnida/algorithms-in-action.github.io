// Adapted from Quicksort - could rename a few things

/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import { generatePresetList, getPresetMeta } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_PRESET = 'random';
const DEFAULT_SIZE = 12;
const MIN_SIZE = 5;
const MAX_SIZE = 30;
const MIN_VALUE = 1;
const MAX_VALUE = 50;
const PRESET_OPTIONS = ['best', 'worst', 'random', 'adversarial'];
const DEFAULT_ARR = generatePresetList(
  DEFAULT_PRESET,
  DEFAULT_SIZE,
  'msort_lista_td',
  MIN_VALUE,
  MAX_VALUE,
);
const MERGE_SORT = 'Merge Sort (lists)';
const MERGE_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

function MergesortParam() {
  const { dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null)
  const [array, setArray] = useState(DEFAULT_ARR)
  const [preset, setPreset] = useState(DEFAULT_PRESET);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const presetMeta = getPresetMeta(preset, 'msort_lista_td');

  const updateArray = (nextPreset, nextSize) => {
    setMessage(null);
    setArray(generatePresetList(nextPreset, nextSize, 'msort_lista_td', MIN_VALUE, MAX_VALUE));
  };

  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [preset, size],
  );

  useEffect(() => {
    dispatch(GlobalActions.SET_INPUT_PRESET, {
      preset,
      label: presetMeta.label,
      desc: presetMeta.desc,
      complexity: presetMeta.complexity,
      algorithmKey: 'msort_lista_td',
    });
  }, [dispatch, preset, presetMeta.label, presetMeta.desc, presetMeta.complexity]);

  return (
    <>
      <div className="form">
        <ListParam
          name="msort_lista_td"
          buttonName="Reset"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={array}
          SET_VAL={setArray}
          REFRESH_FUNCTION={() => generatePresetList(preset, size, 'msort_lista_td', MIN_VALUE, MAX_VALUE)}
          ALGORITHM_NAME={MERGE_SORT}
          EXAMPLE={MERGE_SORT_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      <div className={`presetControls preset-${preset}`}>
        <label className="presetLabel">
          Preset
          <select
            className="presetSelect"
            value={preset}
            onChange={(e) => {
              const nextPreset = e.target.value;
              setPreset(nextPreset);
              updateArray(nextPreset, size);
            }}
          >
            {PRESET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="presetLabel">
          Size
          <input
            className="sizeSlider"
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={size}
            onChange={(e) => {
              const nextSize = Number(e.target.value);
              setSize(nextSize);
              updateArray(preset, nextSize);
            }}
          />
          <span className="sizeValue">{size}</span>
        </label>
        <span className="presetBadge">{presetMeta.label}</span>
        <span className="presetHint">{presetMeta.desc}</span>
      </div>
      {/* render success/error message */}
      {message}
    </>
  )
}

export default MergesortParam
