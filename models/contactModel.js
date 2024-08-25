const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add the contact name"],
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            required: [true, "Please add the contact email"],
            unique: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        phone: {
            type: String,
            required: [true, "Please add the contact phone"],
            unique: true,
            match: /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Contact", contactSchema);