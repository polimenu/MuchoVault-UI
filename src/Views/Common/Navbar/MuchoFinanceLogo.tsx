import MuchoFinanceLogo from '@Assets/Elements/MuchoFinanceLogo';
import React from 'react';

export const MuchoFinanceLogoComponent: React.FC<{
  logoWidth?: number;
  logoHeight?: number;
  className?: string;
  fontSize?: string;
  hideText?: boolean;
}> = ({ logoWidth, logoHeight, className = '', fontSize, hideText }) => {
  return (
    <div className={`fredson flex items-center ${className}`}>
      <MuchoFinanceLogo width={logoWidth || 26} height={logoHeight || 26} />
      {!hideText && <div
        className={`text-1 ${fontSize ? fontSize : 'text-[18px]'
          } ml-[4px] font-semibold`}
      >
        Mucho
      </div>}
    </div>
  );
};
