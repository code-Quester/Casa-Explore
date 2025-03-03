const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // password field is handled by passport-local-mongoose plugin
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User; 

