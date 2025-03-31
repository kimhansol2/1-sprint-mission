import { User } from "../src/types/userTypes";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password" | "refreshToken">;
    }
  }
}
