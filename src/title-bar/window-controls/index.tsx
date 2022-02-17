import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import styles from '../style.css';
import { ThemeContext } from '../theme';
import { ControlsTheme, WindowControlsProps } from '../typings';
import WindowButton from './button';
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from './icons';

const buttons = (
  isWin: boolean,
  maximized: boolean,
  onMinimize: () => void,
  onMaximize: () => void,
  onClose: () => void
) => [
  {
    type: "minimize",
    onClick: onMinimize,
    icon: <MinimizeIcon isWin={isWin} />,
  },
  {
    type: "maximize",
    onClick: onMaximize,
    icon: maximized ? (
      <RestoreIcon isWin={isWin} />
    ) : (
      <MaximizeIcon isWin={isWin} />
    ),
  },
  {
    type: "close",
    onClick: onClose,
    icon: <CloseIcon isWin={isWin} />,
  },
];

const WindowControls = ({
  onMinimize,
  onMaximize,
  onClose,
  maximized,
  disableMinimize,
  disableMaximize,
  focused,
}: WindowControlsProps) => {
  const { platform, bar, controls } = useContext(ThemeContext);
  const isWin = platform === "win32";
  const itemWidth = isWin ? 48 : 40;
  const width =
    itemWidth * (3 - (disableMaximize ? 1 : 0) - (disableMinimize ? 1 : 0));
  return (
    <div
      className={styles.ControlsWrapper}
      style={{
        opacity: focused ? 1 : bar!.inActiveOpacity,
        width,
      }}
    >
      {buttons(isWin, maximized ?? false, onMinimize!, onMaximize!, onClose!)
        .filter(
          (x) =>
            !(
              (disableMaximize && x.type == "maximize") ||
              (disableMinimize && x.type == "minimize")
            )
        )
        .map((b) => {
          return (
            <WindowButton
              key={b?.type}
              platform={platform}
              close={b?.type === "close"}
              onClick={b.onClick}
              controls={controls as Required<ControlsTheme>}
            >
              {b.icon}
            </WindowButton>
          );
        })}
    </div>
  );
};

WindowControls.propTypes = {
  focused: PropTypes.bool,
  onMinimize: PropTypes.func,
  onMaximize: PropTypes.func,
  onClose: PropTypes.func,
};

export default WindowControls;
