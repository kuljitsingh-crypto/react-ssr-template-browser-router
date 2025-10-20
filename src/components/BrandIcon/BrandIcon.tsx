import { useConfiguration } from "@src/context";
import classNames from "classnames";
import React from "react";

type BrandIconProps = {
  className?: string;
};
function BrandIcon(props: BrandIconProps) {
  const { className } = props;
  const config = useConfiguration();
  const brandClasses = classNames("brandIcon", className);
  const brandDivClass = classNames("brandIconContainer");
  return (
    <div className={brandDivClass}>
      <img src={config.branding.icon} alt='' className={brandClasses} />
    </div>
  );
}

export default BrandIcon;
