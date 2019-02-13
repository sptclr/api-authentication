const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { JWT_SECRET } = require('./configuration');

const User = require('./models/user');

//JSON WEB TOKENS STRATEGY
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{    
        // find the user specified in token
        const user = await User.findById(payload. sub);

        // if user doesn't exists, handle it
        if (!user){
            return done(null, false);
        }

        // Otherwise, return th user
        done (null, user)

    } catch(error){
        done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email' //usernamefield is same as we login, so we can assume that email too in this case
}, async (email, password, done) => {
    try{   
        //find the user give the email
        const user = await User.findOne({ email });
        //why we use findone cause.. we didnt need the id, just an email

        //if not, handle it
        if (!user){
            return done(null, false);
        }

        //check if the password is correct
        const isMatch = await user.isValidPassword(password);

        //if not, handle it
        if(!isMatch){
            return done(null, false);
        }

        //otherwise, return the user
        done(null, user);
        
    } catch(error){
        done(error, false)
    }
}))