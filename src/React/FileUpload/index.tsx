import React, { ChangeEvent, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { getClassName, noop } from "../Base";
import { _ } from "../../utils/i18n";

const uuid = "2a48e77845ef4c8090cf11345c3a0bbe";

interface FileUploadProps {
  onFile?: (file: File, order?: number) => void;
  multiple?: boolean;
}

export const FileUpload = (props: FileUploadProps): React.ReactElement => {
  const { onFile, multiple } = props;

  const onPaste = (e: ClipboardEvent): void => {
    if (!e.clipboardData) {
      return;
    }
    if (!e.clipboardData.items) {
      return;
    }
    if (!onFile) {
      return;
    }
    const { items } = e.clipboardData;

    // only care obj.kind is 'file', don't care obj.kind is 'string'
    // when paste there are multi items passed by OS
    for (let i = 0, l = items.length; i < l; i += 1) {
      const obj = items[i];
      if (obj.kind !== "file") {
        continue;
      }
      const file = obj.getAsFile();
      if (file) {
        onFile(file, i);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("paste", onPaste);
    };
  }, []);

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    if (!onFile) {
      return;
    }
    for (let i = 0, l = e.target.files.length; i < l; i += 1) {
      const file = e.target.files[i];
      onFile(file, i);
    }
  };
  return (
    <div className={getClassName("FileUpload")}>
      <div className="wrapper">
        <div className="upload">
          <input type="file" multiple={!!multiple} onChange={onFilesChange} />
        </div>
        <div className="plus normal">
          <img src="https://chatbot.sp-cdn.shopee.com/web/Anoxm7MAnJRS0P8RjgAARw.svg" />
        </div>
        <div className="plus hover">
          <img
            className="hover"
            src="https://chatbot.sp-cdn.shopee.com/web/AnoxMlkAJIBj0P8RAQQARw.svg"
          />
        </div>
        <div className="text">{_("Drag & Drop Files Here")}</div>
        <div className="text">{_("or Paste Directly on This Page")}</div>
      </div>
    </div>
  );
};

FileUpload.defaultProps = {};

/* develblock:start */
if (document.getElementById(uuid)) {
  setTimeout(() => {
    ReactDOM.render(<FileUpload />, document.getElementById(uuid));
  }, 1);
}
/* develblock:end */
