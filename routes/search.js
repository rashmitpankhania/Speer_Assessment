const express = require("express");
const {searchNotesByKeyword} = require("../config/database");

var router = express.Router();
/* get notes by keyword */
router.get('/search/:query', async function (req, res, next) {
    try {
        const notes = await searchNotesByKeyword(req.user.user_id, req.params.query);
        return res.status(200).send(notes);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;