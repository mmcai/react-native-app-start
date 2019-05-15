export class FetchError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.code = statusCode;
    this.success = false;
  }
}
