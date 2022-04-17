import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { getClassName, noop } from "../Base";
import { Upyun } from "../../api/upyun";
import { Upload } from "../Upload";
import { getUrlPrefix } from "../../api/config";

const uuid = "f8403306efa1402198993e0405aa88ad";
interface PageIndexProps {}

type ItemType = {
  name: string;
  url: string;
  stamp: number;
};

export const PageIndex = (props: PageIndexProps): React.ReactElement => {
  const [uploadKey, setUploadKey] = useState<number>(0);
  const [itemList, setItemList] = useState<ItemType[] | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetch = () => {
    new Upyun()
      .dir("/")
      .call()
      .then((response) => {
        const data = response.data;
        if (!data) {
          setItemList([]);
          return;
        }
        const objList: ItemType[] = [];
        const prefix = getUrlPrefix();
        data.split("\n").forEach((row: string) => {
          const cell = row.split("\t");
          const name = cell[0];
          objList.push({
            name,
            url: `${prefix}/${name}`,
            stamp: Number(cell[3]),
          });
        });
        objList.sort((a, b) => {
          return a.stamp > b.stamp ? -1 : 1;
        });
        setItemList(objList);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setUploadKey(uploadKey + 1);
  }, [itemList]);

  const onUpload = (name: string) => {
    const prefix = getUrlPrefix();
    const stamp = new Date().getTime();
    setItemList([
      { name, url: `${prefix}/${name}`, stamp },
      ...(itemList || []),
    ]);
  };

  const copy = (obj: ItemType) => {
    return () => {
      window.navigator.clipboard.writeText(obj.url).then(
        () => {
          onSuccess(`Copy Successfully`);
        },
        (err) => {
          onError(err);
        }
      );
    };
  };

  const onSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 1300);
  };

  const onError = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 1300);
  };

  return (
    <div className={getClassName("PageIndex")}>
      {success ? (
        <div className="msg success">
          <span>{success}</span>
          <span className="close" onClick={() => setSuccess("")}>
            ×
          </span>
        </div>
      ) : null}
      {error ? (
        <div className="msg error">
          <span>{error}</span>
          <span className="close" onClick={() => setError("")}>
            ×
          </span>
        </div>
      ) : null}

      <div className="wrapper">
        <div className="upload" key={uploadKey}>
          <Upload onError={onError} onSuccess={onSuccess} onUpload={onUpload} />
        </div>
        {!itemList ? <div className="loading">Loading ...</div> : null}
        <div className="content">
          {(itemList || []).map((obj) => {
            return (
              <div className="item" key={obj.name} onClick={copy(obj)}>
                <div
                  className="img"
                  style={{
                    backgroundImage: `url(${obj.url})`,
                  }}
                />
                <div className="layer">
                  <div className="text">Click to Copy URL</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

PageIndex.defaultProps = {};

/* develblock:start */
if (document.getElementById(uuid)) {
  setTimeout(() => {
    ReactDOM.render(<PageIndex />, document.getElementById(uuid));
  }, 1);
}
/* develblock:end */
