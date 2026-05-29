/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import { generatePresetList, getPresetMeta } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_PRESET = 'random';
const DEFAULT_SIZE = 10;
const MIN_SIZE = 5;
const MAX_SIZE = 30;
const MIN_VALUE = 1;
const MAX_VALUE = 100;
const PRESET_OPTIONS = ['best', 'worst', 'random', 'adversarial'];

const DEFAULT_NODES = generatePresetList(
  DEFAULT_PRESET,
  DEFAULT_SIZE,
  'heapSort',
  MIN_VALUE,
  MAX_VALUE,
);
const HEAP_SORT = 'Heap Sort';
const HEAP_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

function HeapsortParam() {
  const { dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [preset, setPreset] = useState(DEFAULT_PRESET);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const presetMeta = getPresetMeta(preset, 'heapSort');

  const updateNodes = (nextPreset, nextSize) => {
    setMessage(null);
    setNodes(generatePresetList(nextPreset, nextSize, 'heapSort', MIN_VALUE, MAX_VALUE));
  };

  useEffect(() => {
    dispatch(GlobalActions.SET_INPUT_PRESET, {
      preset,
      label: presetMeta.label,
      desc: presetMeta.desc,
      complexity: presetMeta.complexity,
      algorithmKey: 'heapSort',
    });
  }, [dispatch, preset, presetMeta.label, presetMeta.desc, presetMeta.complexity]);

  return (
    <>
      <div className="form">
        <ListParam
          name="heapSort"
          buttonName="Sort"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={nodes}
          SET_VAL={setNodes}
          REFRESH_FUNCTION={() => generatePresetList(preset, size, 'heapSort', MIN_VALUE, MAX_VALUE)}
          ALGORITHM_NAME={HEAP_SORT}
          EXAMPLE={HEAP_SORT_EXAMPLE}
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
              updateNodes(nextPreset, size);
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
              updateNodes(preset, nextSize);
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
  );
}

export default HeapsortParam;
