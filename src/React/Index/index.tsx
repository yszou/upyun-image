import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.sass";
import { getClassName, noop } from "../Base";
import { Upyun } from "../../api/upyun";
import { Upload } from "../Upload";

const uuid = "decddea7436f49af8d1d325324ccce67";
interface IndexProps {}

type ItemType = {
  name: string;
  url: string;
  stamp: number;
};

const PREFIX = "https://img.zys.me";

export const Index = (props: IndexProps): React.ReactElement => {
  const [itemList, setItemList] = useState<ItemType[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    new Upyun()
      .dir("/")
      .call()
      .then((response) => {
        const data = response.data;
        const itemList: ItemType[] = [];
        data.split("\n").forEach((row: string) => {
          const cell = row.split("\t");
          const name = cell[0];
          itemList.push({
            name,
            url: `${PREFIX}/${name}`,
            stamp: Number(cell[3]),
          });
        });
        itemList.sort((a, b) => {
          return a.stamp > b.stamp ? -1 : 1;
        });
        setItemList(itemList);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      onUpload('x');
    }, 5000);
  }, []);

  const onUpload = (name: string) => {
    console.log(itemList);
    setItemList([
      { name, url: `${PREFIX}/${name}`, stamp: new Date().getTime() },
      ...itemList,
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

  const genItemList = () => {
    return itemList.map((obj) => {
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
    });
  };
  return (
    <div className={getClassName("Index")}>
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
        <div className="header"></div>
        <div className="upload">
          <Upload onError={onError} onUpload={onUpload} />
        </div>
        <div className="content">{genItemList()}</div>
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
