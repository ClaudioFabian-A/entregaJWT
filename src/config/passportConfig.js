import passport from "passport";
import local from 'passport-local';
import usersModel from "../DAO/mongoose/models/usersModel.js";
import UserManager from "../DAO/mongoose/managers/UserManager.js";
import { createHash } from "../utils.js";
import { validatePassword } from "../utils.js";
import GitHubStrategy from "passport-github2";



import auth from "../services/auth.js";
import { Strategy, ExtractJwt } from "passport-jwt";
// import { cookieExtractor } from '../utils.js';


let UserServices = new UserManager();
const LStrategy = local.Strategy;

const initializesStrategy = () => {
    passport.use("register", new LStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        try {
            const {
                firstName,
                lastName,
            } = req.body;

            let user = await UserServices.getUserBy({ email })
            // if (!firstName || !lastName) return done(null, false, { message: "incomplete values" });
            // const user = await UserServices.getBy({ email });

            if (user) {
                return done(null, false, { message: "user existente" })
            }
            const newUser = {
                firstName,
                lastName,
                email,
                password: createHash(password),
             
            }
            let result = await UserServices.create(newUser);
            done(null, result)

        } catch (error) {
            return done("error en passport config1")
        }
    }))





    passport.use('login', new LStrategy({ usernameField: "email", session: false }, async (email, password, done) => {
        // const { email, password } = req.body;
        // if (!email || !password) return done(null, false, { message: "incomplete values" });
        try {
            const user = await UserServices.getUser({ email: email })
            if (!user) return done(null, false, { message: "incorrect Credentials" });
            // const isValid = await auth.validatePassword(password, user.password);
            if (!isValid(user, password)) return done(null, false, { message: "incorrect Credentials" });
            return done(null, user);
        } catch (error) { return done(error); }
    }));


    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.58d27fe75eef1f04",
        clientSecret: "477c7dbb3b12777ca6c0a047b0ae07b40a6c1c37",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // const { email, name } = profile._json;
            let user = await UserServices.getBy({ email: profile._json.email });
            console.log(user);
            if (!user) {
                let newUser2 = {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    // firstName: profile._json.name,
                    // lastName: " ",
                    // email: profile._json.email,
                    // password: "",
                    // Admin: false,

                };
                let result = await UserServices.create(newUser2);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }

    }));
    passport.serializeUser((user, done) => { done(null, user._id) });
    passport.deserializeUser(async (id, done) => {
        let user = await UserServices.findById(id);
        done(null, user);
    });



    // passport.use('jwt', new Strategy({
    //     jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    //     secretOrKey: 'Claudio'
    // }, async (payload, done) => {
    //     return done(null, payload);
    // }));
}
export default initializesStrategy;