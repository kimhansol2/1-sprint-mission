class UnauthorizedError extends Error {
  constructor(modelName, id) {
    super(`${modelName} with id ${id} not found`);
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
