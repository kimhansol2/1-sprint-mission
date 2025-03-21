class UnauthorizedError extends Error {
  constructor(field) {
    super(`${field} non-user attempted to log in`);
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
