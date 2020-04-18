const express = require('express');
const router = express.Router();
const randomstring = require("randomstring")

router.post("/setName", function(req, res, next) {
    const db = req.app.get("db")
    let name = req.body.name.trim()
    if(name.length <= 0) {
        name = "Zebra"
    }
    if(req.session.participantId) {
    } else {
        const newParticipandId = randomstring.generate();
        req.session.participantId = newParticipandId;
    }
    res.sendStatus(200)
})

router.post('/chat/sendMessage', (req, res, next) => {
    const db = req.app.get("db")
    console.log("message send")
    db.collection("stream").updateOne({"currentStream": true}, {$push: {
        liveChats: {
            message: req.body.message,
            chatID: req.body.chatID,
            user_firstName: req.body.user_firstName,
            user: req.body.user,
            chatTag: req.body.chatTag,
            timestamp: Date.now(),
            flagged: false,
            flagData: {}
        }
    }})
    res.sendStatus(200)
})

module.exports = router;
