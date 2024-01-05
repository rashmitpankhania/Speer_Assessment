var express = require('express');
const {
    findDocuments, createDocument, updateDocument, addNoteToUser, createNoteForUser, getNotesForUser,
    getNoteByIdForUser, updateNoteByIdForUser, deleteNoteByIdForUser
} = require("../config/database");
var router = express.Router();

/* create note */
router.post('/', async function (req, res, next) {
    try {
        const {content} = req.body;
        const createdNote = await createNoteForUser(content, req.user.user_id);
        return res.status(201).send(createdNote);
    } catch (e) {
        console.log(e);
    }
});

/* get all notes */
router.get('/', async function (req, res, next) {
    try {
        const notes = await getNotesForUser(req.user.user_id);
        return res.status(200).send(notes);
    } catch (e) {
        console.log(e);
    }
});


/* get note by id */
router.get('/:id', async function (req, res, next) {
    try {
        const notes = await getNoteByIdForUser(req.user.user_id, req.params.id);
        if (notes)
            return res.status(200).send(notes);
        return res.status(404).send('note not found or user is not authorised')
    } catch (e) {
        console.log(e);
    }
});

/* update note by id */
router.put('/:id', async function (req, res, next) {
    try {
        const { content } = req.body;
        const notes = await updateNoteByIdForUser(req.user.user_id, req.params.id, content);
        if (notes)
            return res.status(200).send(notes);
        return res.status(404).send('note not found or user is not authorised')
    } catch (e) {
        console.log(e);
    }
});

/* delete note by id */
router.delete('/:id', async function (req, res, next) {
    try {
        const notes = await deleteNoteByIdForUser(req.user.user_id, req.params.id);
        if (notes)
            return res.status(200).send(notes);
        return res.status(404).send('note not found or user is not authorised')
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;
