const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.pre('save', async function (next) {
    try{
        //Generate salt
        const salt = await bcrypt.genSalt(10);
        //why using normal function not arrow function?
        //cause we need take password dynamic using `this` method, but arrow function can't do it

        // Generate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(this.password, salt);
        // Re-assign hashed version over original, plain text password
        this.password = passwordHash;
        next();
    } catch(error){
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch(error) {
        throw new Error (error)
    }
};

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;