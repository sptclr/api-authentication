const JWT = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = require('../configuration');

signToken = user => {
    return JWT.sign({
        iss: 'NodeAPI',
        sub: user._id, //get subject from _id
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET)
}

module.exports = {
    signUp : async (req,res, next) => {
        //OLD SCHOOL
        // try{
        // } catch(error){
        // }
        //alternative --> express-promise-router
        
        const { email, password } = req.value.body;

        // Check if there is a user with the same email
        const foundUser = await User.findOne({ email });
        if( foundUser ) { 
             return res.status(403).json({ 
                error: 'Email is already in use'
            })
        }

        // Create a new user
        const newUser = new User({email, password});
        await newUser.save();

        // Respond with token
        const token = signToken(newUser);

        // Generate with token
        res.status(200).json({ token });

    },

    signIn : async (req, res, next) => {
        //Generate Token
        // console.log(req.user)
        const token = signToken(req.user);
        res.status(200).json({ token })

    },

    secret : async (req, res, next) => {
        res.json({ secret: "resource"})
    },
}