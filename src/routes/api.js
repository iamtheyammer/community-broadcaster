const express = require('express');
const router = express.Router();
const randomstring = require("randomstring")

const updateParticipant = require("./db/stream/updateParticipant")
const setParticipant = require("./db/stream/setParticipant")

router.post("/setName", function(req, res, next) {
    const db = req.app.get("db")
    let name = req.body.name.trim()
    if(name.length <= 0) {
        name = "Zebra"
    }
    if(req.session.participantId) {
        updateParticipant(db, name, req.session.participantId)
    } else {
        const newParticipandId = randomstring.generate();
        setParticipant(db, name, newParticipandId)
        req.session.participantId = newParticipandId;
    }
    res.sendStatus(200)
})

router.post('/slateControl', (req, res, next) => {
    if(req.user && req.user.auth == 2) {
        const db = req.app.get("db")
        let slateType = 1;
        console.log(req.body)
        console.log(req.body)
        if(req.body.selection == "Bars and Tones") {
            slateType = 1
        }
        if(req.body.selection == "Splash") {
            slateType = 2
        }
        if(req.body.selection == "Maintainance") {
            slateType = 3
        }
        async function run() {
            db.collection("siteControls").updateOne({"identifier": "slate"}, {$set: {
                state: (req.body.state == 'true'),
                slateType
            }})
            res.json("Success")
        } run()
    }
})

module.exports = router;
