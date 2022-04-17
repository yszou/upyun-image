import md5 from "js-md5";
const KEY = "v1";
const sign = (s: string) => {
  return md5(KEY + s);
};

export const setValue = (name: string, value: any): void => {
  if (!window.localStorage) {
    throw Error("no window.localStorage");
  }
  let js = null;
  try {
    js = JSON.stringify(value);
  } catch (e) {
    throw Error("not support the format of this value");
  }
  const s = sign(js);
  window.localStorage[name] = `${s}|${js}`;
};

export const getValue = <T = any>(name: string): T | null => {
  if (!window.localStorage) {
    return null;
  }
  const content = window.localStorage[name];
  if (!content) {
    return null;
  }
  const partList = content.split("|");
  if (partList.length <= 1) {
    return null;
  }
  const s = partList[0];
  const raw = partList.slice(1).join("|");
  if (sign(raw) !== s) {
    return null;
  }
  let js = null;
  try {
    js = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  return js;
};
