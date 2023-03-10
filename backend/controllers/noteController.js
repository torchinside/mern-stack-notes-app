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
    
    const createdNote = await Note.create({ user, title, text });

    if(!createdNote)
        return res.status(400).json('Invalid note data received.');

    res.status(201).json({ message: `New note ${ title } created` });
});

// @desc Update note
// @method PATCH
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, title, text, completed, user } = res.body;

    if(!id || !title || !text || !user || typeof completed !== 'boolean')
        return res.status(400).json({ message: "All field are required" });

    const foundedNote = await Note.findById(id).exec();

    if(!foundedNote)
        return res.status(400).json({ message: 'Note not found' });

    foundedNote.title = title;
    foundedNote.text = text;
    foundedNote.completed = completed;

    const updateNote = await foundedNote.save(); 

    res.json({ message: `Note ${ updateNote.title } updated` })

});

// @desc Delete note
// @method DELETE
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if(!id)
        return res.status(400).json({ message: 'Id required' });

    const foundedNote = await Note.findById(id).exec();

    if(!foundedNote)
        return res.status(400).json({ message: 'Note not found' });

    const deletedNote = await foundedNote.delete();

    res.json({ message: `Note ${ deletedNote.title } -- Id: ${ deletedNote._id } deleted` })

});

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
};