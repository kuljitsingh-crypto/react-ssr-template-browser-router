import { useConfiguration } from "@src/context";
import classNames from "classnames";
import React from "react";

type HomeIconProps = {
  className?: string;
  containerClassName?: string;
};
function HomeIcon(props: HomeIconProps) {
  const { className, containerClassName } = props;
  const config = useConfiguration();
  const homeClasses = classNames("homeIcon", className);
  const homeDivClass = classNames("homeIconContainer", containerClassName);
  return (
    <div className={homeDivClass}>
      <img src={config.images.homeIcon} alt='' className={homeClasses} />
    </div>
  );
}

export default HomeIcon;
