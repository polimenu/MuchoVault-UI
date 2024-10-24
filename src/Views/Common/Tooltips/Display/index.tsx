import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Big from 'big.js';
import NumberTooltip from '..';
import { toFixed } from '@Utils/NumString';
import { numberWithCommas } from '@Utils/display';
import { lt } from '@Utils/NumString/stringArithmatics';
interface IDisplayProp {
  data: string | number | null | undefined;
  unit?: string;
  className?: string;
  precision?: number;
  disable?: boolean;
  label?: React.ReactChild;
  content?: ReactNode;
  placement?: 'top' | 'bottom';
  colored?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
}

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit '; //remove ml-auto

const stringify = (num: string | number) => {
  if (typeof num == 'number') {
    num = num.toString();
  }
  return num as string;
};
export const Display: React.FC<IDisplayProp> = ({
  colored,
  data,
  unit,
  label,
  disable,
  placement,
  className,
  content,
  precision = 2,
  onOpen
}) => {
  const prev = useRef<string | number>();
  if (data == null || data == undefined || data == '') {
    data = '0';
  }
  const isNumeric = (typeof data === 'number');

  useEffect(() => {
    return () => {
      prev.current = data;
    };
  }, [data]);

  if (isNumeric)
    data = data.toString();

  className = content ? className + ' ' + underLineClass : className;
  let tooltipContent: ReactNode | string =
    (isNumeric ? numberWithCommas(toFixed(data, 6)) : '') +
    (unit ? ' ' + unit : '');
  if (content) {
    tooltipContent = <div className="px-4 py-2">{content}</div>;
  }
  if (disable) {
    tooltipContent = '';
  }
  const Unit = unit ? <>{' ' + unit}</> : '';
  const generatedStyles = `flex mono content-center ${colored ? 'green' : ''} ${className || ''}`;

  if (!tooltipContent) {
    return <div className={generatedStyles}>
      {label}
      {isNumeric && numberWithCommas(toFixed(data, precision))}
      {!isNumeric && data}
      {Unit}
    </div>

  }
  else {
    return <NumberTooltip content={tooltipContent} placement={placement} onOpen={onOpen}>
      <div className={generatedStyles}>
        {label}
        {isNumeric && numberWithCommas(toFixed(data, precision))}
        {!isNumeric && data}
        {Unit}
      </div>
    </NumberTooltip>;

  }
};
