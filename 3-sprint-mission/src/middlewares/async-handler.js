export default function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log("error");
      next(e);
    }
  };
}
