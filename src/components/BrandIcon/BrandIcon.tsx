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
  return <img src={config.branding.icon} alt='' className={brandClasses} />;
}

export default BrandIcon;
