const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add the user name"],
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            required: [true, "Please add the user email"],
            unique: [true, "Email address is already in use"],
            match: [/\S+@\S+\.\S+/, "Please add a valid email address"]
        },
        password: {
            type: String,
            required: [true, "Please add the user password"],
            minlength: 8
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
