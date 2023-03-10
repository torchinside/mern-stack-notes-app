const Note = require('../models/Note');
const asyncHandler = require('express-async-handler')

// @desc Get all notes
// @method GET
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().select().lean();

    if(!notes?.length)
        return res.status(400).json({ message: 'Notes not found' });

    res.json(notes);
});

// @desc Create new note
// @method POST
// @access Private
const createNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    if(!user || !title || !text) {
        return res.status(400).json({ message: 'All field are required.' });
    }

    const duplicateNote = await Note.findOne({ title }).lean().exec();

    if(duplicateNote)
        return res.status(400).json({ message: 'Duplicated note.' })
    
    const createdNote = await Note.create({ user, title, text });

    if(!createdNote)
        return res.status(400).json('Invalid note data received.');

    res.status(201).json({ message: `New note ${ title } created` });
});

// @desc Update note
// @method PATCH
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    
});

// @desc Delete note
// @method DELETE
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    
});

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
};