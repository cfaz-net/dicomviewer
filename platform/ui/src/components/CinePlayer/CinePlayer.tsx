import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import Tooltip from '../Tooltip';
import InputRange from '../InputRange';
import { Icons } from '@ohif/ui-next';
import './CinePlayer.css';

export type CinePlayerProps = {
  className: string;
  isPlaying: boolean;
  minFrameRate?: number;
  maxFrameRate?: number;
  stepFrameRate?: number;
  frameRate?: number;
  onFrameRateChange: (value: number) => void;
  onPlayPauseChange: (value: boolean) => void;
  onClose: () => void;
  updateDynamicInfo?: () => void;
  dynamicInfo?: {
    dimensionGroupNumber: number;
    numDimensionGroups: number;
    label?: string;
  };
};

const fpsButtonClassNames =
  'cursor-pointer text-primary-active active:text-primary-light hover:bg-desert-700 w-4 flex items-center justify-center';

const CinePlayer: React.FC<CinePlayerProps> = ({
  className,
  isPlaying = false,
  minFrameRate = 1,
  maxFrameRate = 90,
  stepFrameRate = 1,
  frameRate: defaultFrameRate = 24,
  onFrameRateChange = () => { },
  onPlayPauseChange = () => { },
  onClose = () => { },
  dynamicInfo = {},
  updateDynamicInfo,
}) => {
  const isDynamic = !!dynamicInfo?.numDimensionGroups;
  const [frameRate, setFrameRate] = useState(defaultFrameRate);
  const debouncedSetFrameRate = useCallback(debounce(onFrameRateChange, 100), [onFrameRateChange]);

  const getPlayPauseIconName = () => (isPlaying ? 'icon-pause' : 'icon-play');

  const handleSetFrameRate = (frameRate: number) => {
    if (frameRate < minFrameRate || frameRate > maxFrameRate) {
      return;
    }
    setFrameRate(frameRate);
    debouncedSetFrameRate(frameRate);
  };

  useEffect(() => {
    setFrameRate(defaultFrameRate);
  }, [defaultFrameRate]);

  const handleDimensionGroupNumberChange = useCallback(
    (newGroupNumber: number) => {
      if (isDynamic && dynamicInfo) {
        // Here, you would update the component's state or context that controls the current time point index
        // For demonstration, assuming a hypothetical function that updates the time point index
        updateDynamicInfo({
          ...dynamicInfo,
          dimensionGroupNumber: newGroupNumber,
        });
      }
    },
    [isDynamic, dynamicInfo]
  );

  return (
    <div className={className}>
      {isDynamic && dynamicInfo && (
        <InputRange
          value={dynamicInfo.dimensionGroupNumber}
          onChange={handleDimensionGroupNumberChange}
          minValue={1}
          maxValue={dynamicInfo.numDimensionGroups}
          step={1}
          containerClassName="mb-3 w-full"
          labelClassName="text-xs text-white"
          leftColor="#3a3f99"
          rightColor="#3a3f99"
          trackHeight="4px"
          thumbColor="#d5963a"
          thumbColorOuter="#000000"
          showLabel={false}
        />
      )}
      <div
        className={
          'border-secondary-light/60 bg-primary-dark inline-flex select-none items-center gap-2 rounded border px-2 py-2'
        }
      >
        <Icons.ByName
          name={getPlayPauseIconName()}
          className="active:text-primary-light hover:bg-desert-700 cursor-pointer text-white hover:rounded"
          onClick={() => onPlayPauseChange(!isPlaying)}
          data-cy={'cine-player-play-pause'}
        />
        {isDynamic && dynamicInfo && (
          <div className="min-w-16 max-w-44 flex flex-col text-white">
            {/* Add Tailwind classes for monospace font and center alignment */}
            <div className="text-[11px]">
              <span className="w-2 text-white">{dynamicInfo.dimensionGroupNumber}</span>{' '}
              <span className="text-aqua-pale">{`/${dynamicInfo.numDimensionGroups}`}</span>
            </div>
            <div className="text-aqua-pale text-xs">{dynamicInfo.label}</div>
          </div>
        )}

        <div className="border-secondary-light ml-4 flex h-6 items-stretch gap-1 rounded border">
          <div
            className={`${fpsButtonClassNames} rounded-l`}
            onClick={() => handleSetFrameRate(frameRate - 1)}
            data-cy={'cine-player-left-arrow'}
          >
            <Icons.ChevronLeft />
          </div>
          <Tooltip
            position="top"
            className="group/fps cine-fps-range-tooltip"
            tight={true}
            content={
              <InputRange
                containerClassName="h-9 px-2"
                inputClassName="w-40"
                value={frameRate}
                minValue={minFrameRate}
                maxValue={maxFrameRate}
                step={stepFrameRate}
                onChange={handleSetFrameRate}
                showLabel={false}
              />
            }
          >
            <div className="flex items-center justify-center gap-1">
              <div className="flex-shrink-0 text-center text-sm leading-[22px] text-white">
                <span className="inline-block text-right">{`${frameRate} `}</span>
                <span className="text-aqua-pale whitespace-nowrap text-xs">{' FPS'}</span>
              </div>
            </div>
          </Tooltip>

          <div
            className={`${fpsButtonClassNames} rounded-r`}
            onClick={() => handleSetFrameRate(frameRate + 1)}
            data-cy={'cine-player-right-arrow'}
          >
            <Icons.ChevronRight />
          </div>
        </div>
        <Icons.Close
          className="text-primary-active active:text-primary-light hover:bg-desert-700 cursor-pointer hover:rounded"
          onClick={onClose}
          data-cy={'cine-player-close'}
        />
      </div>
    </div>
  );
};

CinePlayer.propTypes = {
  /** Minimum value for range slider */
  minFrameRate: PropTypes.number,
  /** Maximum value for range slider */
  maxFrameRate: PropTypes.number,
  /** Increment range slider can "step" in either direction */
  stepFrameRate: PropTypes.number,
  frameRate: PropTypes.number,
  /** 'true' if playing, 'false' if paused */
  isPlaying: PropTypes.bool.isRequired,
  onPlayPauseChange: PropTypes.func,
  onFrameRateChange: PropTypes.func,
  onClose: PropTypes.func,
  isDynamic: PropTypes.bool,
  dynamicInfo: PropTypes.shape({
    dimensionGroupNumber: PropTypes.number,
    numDimensionGroups: PropTypes.number,
    label: PropTypes.string,
  }),
};

export default CinePlayer;
