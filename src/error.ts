export class ApplicationError extends Error {
  statusCode: number;
  override name: string;
  override message: string;
  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class BRE400 extends ApplicationError {
  constructor(message: string) {
    super("Bad Request Error", message, 400);
  }
}

export class NFE404 extends ApplicationError {
  constructor(message: string) {
    super("Not Found Error", message, 404);
  }
}

export class ICE401 extends ApplicationError {
  constructor(message: string) {
    super("Invalid Credentirals", message, 401);
  }
}

export class ISE500 extends ApplicationError {
  constructor(message: string) {
    super("Internal Server Error", message, 500);
  }
}

export class NAE extends ApplicationError {
  constructor(message: string) {
    super("Not Authorized Error", message, 404);
  }
}