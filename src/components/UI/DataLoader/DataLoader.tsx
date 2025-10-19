import React from "react";
import { FetchStatusVal } from "@src/util/fetchStatusHelper";
import classNames from "classnames";
import css from "./DataLoader.module.css";
import IconSpinner from "@src/components/IconSpinner/IconSpinner";

type Props = {
  status: FetchStatusVal;
  rootClassName?: string;
  iconCLassName?: string;
};

function DataLoader(props: Props) {
  const { status, rootClassName, iconCLassName } = props;
  const classes = classNames(css.root, rootClassName);
  const iconClass = classNames(css.icon, iconCLassName);
  return status.isLoading ? (
    <div className={classes}>
      <IconSpinner className={iconClass} />
    </div>
  ) : null;
}

export default DataLoader;
