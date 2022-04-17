import React from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { getClassName, noop } from "../Base";
import { FileUpload } from "../FileUpload";
import { Upyun } from "../../api/upyun";
import { _ } from "../../utils/i18n";

const uuid = "e4ca4809558d465dbd6c97af33a41ec2";
interface UploadProps {
  onUpload?: (name: string) => void;
  onError?: (error: string) => void;
  onSuccess?: (error: string) => void;
}

export const Upload = (props: UploadProps): React.ReactElement => {
  const { onUpload = noop, onError = noop, onSuccess = noop } = props;
  const onFile = (file: File, order: number = 0) => {
    new Upyun()
      .upload(file, order)
      .call()
      .then((response) => {
        if (response.data.code === 200) {
          onSuccess(_("Upload Successfully"));
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
