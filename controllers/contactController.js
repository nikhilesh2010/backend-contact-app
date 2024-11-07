const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

// @desc Get all the contacts
// @rote GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

// @desc Get contact
// @rote GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    res.status(200).json(contact);
});

// @desc Create contact
// @rote POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is: ",req.body);
    const {name, email, phone} = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('All fields are required');
    }
    const contact = await Contact.create({ name, email, phone, user_id: req.user.id });
    res.status(200).json(contact);
});

// @desc Update contact
// @rote PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }

    if (contact.user_id.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Unauthorized to update this contact');
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedContact);
});

// @desc Delete contact
// @rote DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }

    if (contact.user_id.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Unauthorized to delete this contact');
    }

    await Contact.findByIdAndDelete(contact);
    res.status(200).json({ message: 'Contact deleted successfully' });
});

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact};