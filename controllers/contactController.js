const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

// @desc Get all the contacts
// @rote GET /api/contacts
// @access public
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
});

// @desc Get contact
// @rote GET /api/contacts/:id
// @access public
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
// @access public
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is: ",req.body);
    const {name, email, phone} = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('All fields are required');
    }
    const contact = await Contact.create({name, email, phone});
    res.status(201).json(contact);
});

// @desc Update contact
// @rote PUT /api/contacts/:id
// @access public
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedContact);
});

// @desc Delete contact
// @rote DELETE /api/contacts/:id
// @access public
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }
    await Contact.findByIdAndDelete(contact);
    res.status(200).json({ message: 'Contact deleted successfully' });
});

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact};