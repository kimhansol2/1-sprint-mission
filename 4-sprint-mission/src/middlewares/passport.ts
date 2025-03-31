import passport from "passport";
import localStrategy from "./passport/localStratedy";
import accessTokenStrategy from "./passport/jwtStrategy";

passport.use("local", localStrategy);
passport.use("accessToken", accessTokenStrategy);

export default passport;
