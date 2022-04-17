/// <reference types="react-scripts" />
declare module "*.txt" {
  const content: string;
  export default content;
}

declare module "hmacsha1" {
  const hmacsha1: (key: string, data: string) => string;
  export default hmacsha1;
}
