import { getValue, setValue } from "../utils/localStorage";

let operator = "";
let passwordMd5 = "";
let bucket = "";

const OPERATOR_KEY = "operator";
const PASSWORD_MD5_KEY = "password-md5";
const BUCKET_KEY = "bucket";

export const getOperator = (): string => {
  return operator || getValue(OPERATOR_KEY) || "";
};
export const setOperator = (val: string) => {
  operator = val;
  setValue(OPERATOR_KEY, val);
};

export const getPasswordMd5 = (): string => {
  return passwordMd5 || getValue(PASSWORD_MD5_KEY) || "";
};
export const setPasswordMd5 = (val: string) => {
  passwordMd5 = val;
  setValue(PASSWORD_MD5_KEY, val);
};

export const getBucket = (): string => {
  return bucket || getValue(BUCKET_KEY) || "";
};

export const setBucket = (val: string) => {
  bucket = val;
  setValue(BUCKET_KEY, val);
};

export const getUrlPrefix = (): string => {
  const { protocol, host } = window.location;
  if (host.includes("localhost")) {
    return "https://img.zys.me";
  }
  return `${protocol}//${host}`;
};
