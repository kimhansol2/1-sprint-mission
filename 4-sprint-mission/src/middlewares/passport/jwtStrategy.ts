import {
  Strategy as JwtStrategy,
  ExtractJwt,
  JwtFromRequestFunction,
} from "passport-jwt";
import userService from "../../services/userService";
import { User } from "@prisma/client";

interface JwtPayload {
  userId: number;
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const accessTokenOptions = {
  jwtFromRequest:
    ExtractJwt.fromAuthHeaderAsBearerToken() as JwtFromRequestFunction,
  secretOrKey: jwtSecret,
};

async function jwtVerify(
  payload: JwtPayload,
  done: (
    error: Error | null,
    user?: Omit<User, "password" | "refreshToken"> | false
  ) => void
): Promise<void> {
  try {
    const { userId } = payload;
    const user = await userService.getUserById(userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error instanceof Error ? error : new Error("Unknown error"));
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);

export default accessTokenStrategy;
