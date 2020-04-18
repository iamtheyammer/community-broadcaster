const express = require('express');
const router = express.Router();

const createStream = require('../db/stream/createStream')
const deleteStream = require('../db/stream/deleteStream')

const adminAuth = (req,res,next) => {
    if(req.user.auth === 2) {
        next();
    } else {
        res.sendStatus(403);
    }
}

router.post('/createStream', adminAuth, (req,res,next) => {
    const db = req.app.get("db")
    const data = {
        name: req.body.name,
        date: new Date(req.body.date)
    }
    if(data.name.trim().length <= 0 || !data.date) {
        res.sendStatus(500)
        return;
    }
    try {
        res.json(createStream(db, data))
    } catch(e) {
        throw new Error(e);
        res.sendStatus(500)
    }
})

router.post('/deleteStream', adminAuth, (req,res,next) => {
    const db = req.app.get("db")
    try {
        deleteStream(db, req.body.streamId)
        res.sendStatus(200)
    } catch(e) {
        throw new Error(e);
        res.sendStatus(500)
    }
})

router.post('/slateControl', adminAuth, (req, res, next) => {
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
