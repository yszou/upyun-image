import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { getClassName, noop } from "../Base";
import { _ } from "../../utils/i18n";
import { getOperator, getPasswordMd5, getBucket } from "../../api/config";

const uuid = "cbc0ba5502ae42d9bf876dcec28db4f9";
interface SettingsProps {
  onSave?: (val: Record<string, string>) => void;
}

export const Settings = (props: SettingsProps): React.ReactElement => {
  const { onSave = noop } = props;
  const [operator, setOperator] = useState<string>(getOperator());
  const [passwordMd5, setPasswordMd5] = useState<string>(getPasswordMd5());
  const [bucket, setBucket] = useState<string>(getBucket());
  return (
    <div className={getClassName("Settings")}>
      <div className="wrapper">
        <div className="item operator">
          <div className="name">{_("Operator")}</div>
          <div className="value">
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            />
          </div>
        </div>
        <div className="item password">
          <div className="name">{_("Password MD5")}</div>
          <div className="value">
            <input
              type="text"
              value={passwordMd5}
              onChange={(e) => setPasswordMd5(e.target.value)}
            />
          </div>
        </div>
        <div className="item bucket">
          <div className="name">{_("Bucket")}</div>
          <div className="value">
            <input
              type="text"
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
            />
          </div>
        </div>
        <div className="item">
          <div className="name"></div>
          <div className="value">
            <button onClick={() => onSave({ operator, passwordMd5, bucket })}>
              {_("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Settings.defaultProps = {};

/* develblock:start */
if (document.getElementById(uuid)) {
  setTimeout(() => {
    ReactDOM.render(<Settings />, document.getElementById(uuid));
  }, 1);
}
/* develblock:end */
