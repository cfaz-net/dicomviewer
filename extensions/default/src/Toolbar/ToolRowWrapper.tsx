import React from 'react';
import { useToolbar, ButtonLocation } from '@ohif/core';

interface ToolRowWrapperProps {
  buttonSection: string;
  className?: string;
  show?: boolean;
}

function ToolRowWrapper({ buttonSection, className = '', show = true }: ToolRowWrapperProps) {
  const { onInteraction, toolbarButtons } = useToolbar({
    buttonSection,
  });

  // No need for debugger statement
  if (!toolbarButtons?.length) {
    return null;
  }

  return (
    <div className={`space-x-0.5 sm:space-x-1 flex flex-row flex-wrap items-center gap-0.5 sm:gap-1 ${className}`}>
      {toolbarButtons.map((button, index) => {
        const { id, Component, componentProps } = button;
        return (
          <div
            key={id || index}
            className="flex-shrink-0 min-h-[40px] flex items-center"
          >
            <Component
              {...componentProps}
              onInteraction={onInteraction}
              location={componentProps.location || buttonSection}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ToolRowWrapper;
