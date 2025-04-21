import { useConfiguration } from "@src/context";
import React from "react";

function Sidebar() {
  const config = useConfiguration();

  return <div>Sidebar</div>;
}

export default Sidebar;
