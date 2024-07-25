import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ArrowDropDownRounded } from '@mui/icons-material';
import styled from '@emotion/styled';

const TokenDropdownBackground = styled.div`
  .dropdown-value {
    color: var(--text-1);

    @media only screen and (max-width: 600px) {
      font-size: 1.4rem;
    }

    .assetImage {
      border-radius: 50%;
      object-fit: cover;
      margin-right: 0.9rem;
    }
  }

  .dot {
    width: 0.8rem;
    height: 0.8rem;
    color: var(--text-6);
  }

  .chain-row {
    &.active {
      .chain-container {
        color: var(--text-1);
      }
      .dot {
        color: var(--text-7);
      }
    }
  }
`;

interface ITokenDropdown {
  className?: string;
  activeToken: string;
}


export const TokenDropdown = ({ className, activeToken, setVal, items }) => {
  //console.log("TokenDropdown items");
  //console.log(items);
  return (
    <TokenDropdownBackground>
      <BufferDropdown
        items={items}
        chainDropDown={false}
        dropdownBox={(activeItem, isOpen, disabled) => {
          return (
            <div
              className={`flex items-center justify-center text-f13  h-[30px] w-max rounded-[7px] pl-3 pr-[1px] sm:pr-1 transition-all duration-300 ${isOpen ? 'bg-3' : 'bg-4 hover:brightness-125 hover:bg-1'
                }`}
            >
              <div className="flex items-center dropdown-value f15 capitalize weight-400">
                <span className="sm:hidden">
                  {activeToken}
                </span>
              </div>
              {!disabled && (
                <ArrowDropDownRounded
                  className={`dropdown-arrow transition-all duration-300 w-6 h-6 ease-out ${isOpen ? 'origin rotate-180' : ''
                    }`}
                />
              )}
            </div>
          );
        }}
        className="px-[20px] py-4 bg-1"
        item={(singleItem, handelClose, onChange, active) => (
          <div
            key={singleItem.name}
            role="button"
            onClick={() => {
              setVal(singleItem.name, singleItem.contract, singleItem.decimals);
              handelClose();
            }}
            className={`${singleItem.name === activeToken && 'active text-1'
              } chain-row flex min-w-max justify-between items-center py-3 text-4 hover:text-1 text-f15 font-normal transition-all duration-150 ease-in-out`}
          >
            <span className="flex items-center mr-4 capitalize">
              {singleItem.displayName}
            </span>
            <FiberManualRecordIcon className={`dot justify-self-end`} />
          </div>
        )}
      />
    </TokenDropdownBackground>
  );
};
