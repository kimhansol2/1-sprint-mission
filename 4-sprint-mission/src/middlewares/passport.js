import passport from "passport";
import localStrategy from "./passport/localStratedy.js";
import accessTokenStrategy from "./passport/jwtStrategy.js";

passport.use("local", localStrategy);
passport.use("accessToken", accessTokenStrategy);

export default passport;
