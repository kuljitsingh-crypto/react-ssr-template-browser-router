import React from "react";
import classNames from "classnames";

import css from "./IconSpinner.module.css";

type IconSpinnerProps = {
  className?: string;
  rootClassName?: string;
};
const IconSpinner = (props: IconSpinnerProps) => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);
  return (
    <svg
      className={classes}
      viewBox='0 0 30 30'
      preserveAspectRatio='xMidYMid'
      xmlns='http://www.w3.org/2000/svg'>
      <circle cx='15' cy='15' r='12' fill='none' strokeLinecap='round'>
        <animateTransform
          attributeName='transform'
          type='rotate'
          calcMode='linear'
          values='0 15 15;180 15 15;720 15 15'
          keyTimes='0;0.5;1'
          dur='0.9s'
          begin='0s'
          repeatCount='indefinite'
        />
        <animate
          attributeName='stroke-dasharray'
          calcMode='linear'
          values='9 56;46 14;9 56'
          keyTimes='0;0.5;1'
          dur='0.9s'
          begin='0s'
          repeatCount='indefinite'
        />
      </circle>
    </svg>
  );
};

export default IconSpinner;
