import { Strategy as LocalStrategy } from "passport-local";
import userService from "../../services/userService.js";
import { User } from "@prisma/client";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
  },
  async (
    email: string,
    password: string,
    done: (error: Error | null, user?: User | false) => void
  ): Promise<void> => {
    try {
      const user = await userService.getUser(email, password);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error instanceof Error ? error : new Error("Unknown error"));
    }
  }
);

export default localStrategy;
