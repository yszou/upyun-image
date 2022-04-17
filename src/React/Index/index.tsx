import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { PageIndex } from "../PageIndex";
import { getClassName } from "../Base";
import { Settings } from "../Settings";
import { _ } from "../../utils/i18n";
import { setBucket, setOperator, setPasswordMd5 } from "../../api/config";

const uuid = "decddea7436f49af8d1d325324ccce67";
interface IndexProps {}

export const Index = (props: IndexProps): React.ReactElement => {
  const [key, setKey] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const onSettings = () => {
    setShowSettings(!showSettings);
  };
  const onSave = ({
    operator,
    passwordMd5,
    bucket,
  }: Record<string, string>) => {
    setOperator(operator);
    setPasswordMd5(passwordMd5);
    setBucket(bucket);
    setShowSettings(false);
    setKey(key + 1);
  };
  return (
    <div className={getClassName("Index")}>
      <div className="wrapper">
        <div className="head">
          <div className="item" onClick={onSettings}>
            {_("Settings")}
          </div>
        </div>

        {showSettings ? (
          <div className="settings">
            <Settings onSave={onSave} />
          </div>
        ) : null}

        <div className="content" key={key}>
          <PageIndex />
        </div>
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
