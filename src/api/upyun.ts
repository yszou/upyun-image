import axios, { AxiosRequestConfig, Method } from "axios";
import hmacsha1 from "hmacsha1";
import { Base64 } from "js-base64";
import { getOperator, getPasswordMd5, getBucket } from "./config";
import moment from "moment";
import { genFilename } from "./filename";

export class Upyun {
  operator: string;
  passwordMd5: string;
  bucket: string;
  prefix: string;

  path: string;
  method: string;
  params: Record<string, any>;
  headers: Record<string, any>;
  form: FormData | null;

  constructor(
    operator: string = "",
    passwordMd5: string = "",
    bucket: string = ""
  ) {
    this.operator = operator || getOperator();
    this.passwordMd5 = passwordMd5 || getPasswordMd5();
    this.bucket = bucket || getBucket();
    this.prefix = "https://v0.api.upyun.com" + "/" + this.bucket;

    this.form = null;
    this.path = "";
    this.method = "";
    this.params = {};
    this.headers = {};
  }

  sign(method: string, uri: string, date: string, policy: string = "") {
    const list = [method, uri, date];
    if (policy) {
      list.push(policy);
    }
    return hmacsha1(this.passwordMd5, list.join("&"));
  }

  call() {
    const date = moment().utc().format("ddd, DD MMM YYYY HH:mm:ss z");
    const sign = this.sign(
      this.method.toUpperCase(),
      "/" + this.bucket + this.path,
      date
    );
    const operator = this.operator;
    const axiosParams: AxiosRequestConfig = {
      url: this.prefix + this.path,
      method: this.method.toUpperCase() as Method,
      responseType: "json",
      headers: {
        Authorization: `UPYUN ${operator}:${sign}`,
        "X-Date": date,
        ...this.headers,
      },
    };
    if (axiosParams.method === "GET") {
      axiosParams.params = this.params;
    } else {
      axiosParams.data = this.form || this.params;
    }
    return axios(axiosParams);
  }

  dir(path: string): Upyun {
    this.method = "get";
    this.path = path;
    return this;
  }

  upload(file: File, order = 0): Upyun {
    this.method = "post";
    this.path = "";

    const operator = this.operator;
    const date = moment().utc().format("ddd, DD MMM YYYY HH:mm:ss z");
    const filePartList = file.name.split(".");
    const suffix = filePartList[filePartList.length - 1];

    const p: Record<string, string> = {
      bucket: this.bucket,
      date,
      "save-key": genFilename(order) + "." + suffix,
      expiration: moment().format("X") + 60 * 10,
    };
    if (suffix === "svg") {
      p["content-type"] = "image/svg+xml";
    }
    const policy = Base64.encode(JSON.stringify(p));
    const form = new FormData();
    form.append("file", file);
    Object.keys(p).map((key) => {
      form.append(key, p[key]);
    });
    form.append("policy", policy);

    const sign = this.sign(
      this.method.toUpperCase(),
      "/" + this.bucket + this.path,
      date,
      policy
    );
    const authorization = `UPYUN ${operator}:${sign}`;
    form.append("authorization", authorization);

    this.form = form;
    return this;
  }
}
