import React from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { getClassName, noop } from "../Base";
import { FileUpload } from "../FileUpload";
import { Upyun } from "../../api/upyun";

const uuid = "e4ca4809558d465dbd6c97af33a41ec2";
interface UploadProps {
  onUpload?: (name: string) => void;
  onError?: (error: string) => void;
}

export const Upload = (props: UploadProps): React.ReactElement => {
  const { onUpload = noop, onError = noop } = props;
  const onFile = (file: File) => {
    new Upyun()
      .upload(file)
      .call()
      .then((response) => {
        if (response.data.code === 200) {
          onUpload(response.data.url);
        } else {
          onError(response.data.msg);
        }
      });
  };
  return (
    <div className={getClassName("Upload")}>
      <div className="upload">
        <FileUpload multiple={true} onFile={onFile} />
      </div>
    </div>
  );
};

Upload.defaultProps = {};

/* develblock:start */
if (document.getElementById(uuid)) {
  setTimeout(() => {
    ReactDOM.render(<Upload />, document.getElementById(uuid));
  }, 1);
}
/* develblock:end */
