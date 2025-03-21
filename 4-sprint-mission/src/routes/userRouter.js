import express from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { createUser, getUser } from "../controller/userController.js";
import passport from "../middlewares/passport.js";

const userRouter = express.Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  asyncHandler(getUser)
);

export default userRouter;
