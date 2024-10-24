import { Tooltip } from "@mui/material";

interface Itooltip {
  content: any;
  className?: string;
  children?: any;
  followCursor?: boolean;
  placement?: "top" | "bottom" | "left" | "right";
  onOpen?: (event: React.SyntheticEvent) => void;
}
const NumberTooltip: React.FC<Itooltip> = ({
  content,
  children,
  className,
  followCursor,
  placement,
  onOpen
}) => {
  const tooltipStyles = {
    tooltip: "tooltip " + className,
    arrow: "arrow",
  };

  return (
    <Tooltip
      title={content}
      id="tooltip"
      placement={placement || "top"}
      arrow
      followCursor={!followCursor ? false : true}
      classes={tooltipStyles}
      enterTouchDelay={0}
      leaveTouchDelay={10000}
      onOpen={onOpen}

    // disableHoverListener={window.innerWidth < 600}
    >
      {children}
    </Tooltip>
  );
};

export default NumberTooltip;
