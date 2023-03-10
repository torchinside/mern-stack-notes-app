const noteController = require('../controllers/noteController');
const express = require('express');
const router = express.Router();

router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNote)
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;