import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { PageIndex } from "../PageIndex";
import { getClassName } from "../Base";

const uuid = "decddea7436f49af8d1d325324ccce67";
interface IndexProps {}

export const Index = (props: IndexProps): React.ReactElement => {
  return (
    <div className={getClassName("Index")}>
      <div className="wrapper">
        <PageIndex />
      </div>
    </div>
  );
};

Index.defaultProps = {};

/* develblock:start */
if (document.getElementById(uuid)) {
  setTimeout(() => {
    ReactDOM.render(<Index />, document.getElementById(uuid));
  }, 1);
}
/* develblock:end */
