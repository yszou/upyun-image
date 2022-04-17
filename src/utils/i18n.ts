import { getValue, setValue } from "./localStorage";
const LOCAL_KEY = "i18n";

import en from "../local/en.json";
import zh_CN from "../local/zh_CN.json";

const LANGUAGE: {
  [index: string]: { dict: Record<string, string> | {}; name: string };
} = {
  en: { dict: en, name: "English" },
  zh_CN: { dict: zh_CN, name: "简体中文" },
};

export const NAME_MAP: { [index: string]: string } = (() => {
  const result: { [index: string]: string } = {};
  Object.keys(LANGUAGE).forEach((key) => {
    result[LANGUAGE[key].name] = key;
  });
  return result;
})();

let language = "";
let dict: { [index: string]: string } = {};
export const getLanguage = (): string => {
  if (language) {
    return language;
  }
  let current = getValue(LOCAL_KEY);
  if (!current) {
    current = window.navigator.language?.replace(/-/g, "_");
  }
  if (!current) {
    return language || "en";
  }
  if (LANGUAGE.hasOwnProperty(current)) {
    return current;
  }
  current = current.split("_")[0];
  if (LANGUAGE.hasOwnProperty(current)) {
    return current;
  }
  return language || "en";
};

export const setLanguage = (lang: string) => {
  language = lang;
  setValue(LOCAL_KEY, lang);
  if (LANGUAGE[lang]) {
    dict = LANGUAGE[lang].dict;
  }
};

setLanguage(getLanguage());

export const _ = (text: string): string => {
  return dict[text] || text;
};
