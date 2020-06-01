class BaseError extends Error {
  constructor(name, status, message) {
    super(message);
    this.status = status;
    this.name = name;
  }
}

export class ValidationError extends BaseError {
  constructor(message) {
    super("ValidationError", 400, message);
  }
}

export class ConflictError extends BaseError {
  constructor(message) {
    super("ConflictError", 409, message);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message) {
    super("UnauthorizedError", 401, message);
  }
}
