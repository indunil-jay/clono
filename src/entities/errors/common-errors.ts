import { StatusCode } from "hono/utils/http-status";

export class Exception extends Error {
  constructor(
    message: string,
    options?: ErrorOptions,
    public code?: StatusCode
  ) {
    super(message, options);
    this.code = code ? code : 400;
  }
}

export class InputParseError extends Exception {
  constructor(
    message: string,
    options?: ErrorOptions,
    public code?: StatusCode
  ) {
    super(message, options);
    this.code = code ? code : 400;
  }
}
