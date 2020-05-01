const express = require('express');
const router = express.Router();

const createStream = require('../db/stream/createStream')
const deleteStream = require('../db/stream/deleteStream')
const banUser = require('../db/users/banUser')
const unbanUser = require('../db/users/unbanUser')
const getSocketId = require('../db/stream/getSocketId')
const getAllParticipants = require('../db/stream/getAllParticipants')
const getUserByGoogleId = require('../db/users/getUserByGoogleId')
const addLog = require("../db/logs/addLog")
const editStream = require("../db/stream/editStream")
const muteUser = require("../db/users/muteUser")

const adminAuth = (req,res,next) => {
    if(req.user) {
        if(req.user.auth >= 2) {
            next();
        } else {
            res.redirect('/auth/redirect')
        }
    } else {
        res.redirect('/')
    }

}

router.post("/userAuth", adminAuth, (req, res, next) => {
    const db = req.app.get("db")
    const socket = req.app.get("socketio")
    db.collection('users').updateOne({'googleId': req.body.googleId}, {$set: {
        auth: req.body.auth
    }})
    res.sendStatus(200)
})

router.post("/muteUser", adminAuth, async (req, res, next) => {
    if(req.body.mute != "true" && req.body.mute != "false") {
        res.sendStatus(500)
        return;
    }
    const db = req.app.get("db")
    const io = req.app.get("socketio")
    const googleId = req.body.googleId
    const socketId = await getSocketId(db, googleId)
    const mute = req.body.mute === "true" ? true : false
    console.log(mute)
    muteUser(db, googleId, mute)
    if(socketId) {
        io.to(socketId).emit('muteUser', mute);
    }
    res.sendStatus(200)
})

router.post('/endStream', adminAuth, (req,res,next) => {
    const db = req.app.get("db")
    const socket = req.app.get("socketio")
    async function getData() {
        var streamState = await db.collection('siteControls').find({"identifier": "streamState"}).toArray()
        if(streamState[0].state) {
            db.collection('siteControls').updateOne({"identifier": "streamState"}, {$set: {
                "state": false,
                "associatedStream": 0
            }})
            db.collection('siteControls').updateOne({"identifier": "currentStream"}, {$set: {
                streamId: 0,
                liveStream: false,
                streamName: "Pending",
                streamRunner: "Pending",
                liveChats: [],
                participants: [],
                participantLogs: []
            }})
            res.sendStatus(200)
            setTimeout(function(){
                socket.emit('reloadSiteClients');
            }, 1000)
        } else {
            res.sendStatus(500)
        }
    } 
    getData()
})

router.post('/createStream', adminAuth, (req,res,next) => {
    const db = req.app.get("db")
    const data = {
        name: req.body.name,
        runner: req.body.runner,
        date: new Date(req.body.date)
    }
    if(data.name.trim().length <= 0 || !data.date || data.runner.trim().length <= 0) {
        res.sendStatus(500)
        return;
    }
    try {
        res.json(createStream(db, data, req.user))
    } catch(e) {
        throw new Error(e);
        res.sendStatus(500)
    }
})

router.post('/editStream', adminAuth, (req,res,next) => {
    const db = req.app.get("db")
    const data = {
        name: req.body.name,
        runner: req.body.runner,
        date: new Date(req.body.date),
        streamId: req.body.streamId
    }
    if(data.name.trim().length <= 0 || !data.date || data.runner.trim().length <= 0) {
        res.sendStatus(500)
        return;
    }
    try {
        res.json(editStream(db, data, req.user))
    } catch(e) {
        res.sendStatsu(500)
        throw new Error(e);
    }
})

router.post('/deleteStream', adminAuth, (req,res,next) => {
    const db = req.app.get("db")
    try {
        const fullName = 
            req.user.firstName[0].toUpperCase() + req.user.firstName.slice(1) + " " +
            req.user.lastName[0].toUpperCase() + req.user.lastName.slice(1)
        const msg = `${fullName} (${req.user.email}) deleted an upcoming stream: ${req.body.streamId}`
        addLog(db, msg, "upcomingStreams")
        deleteStream(db, req.body.streamId)
        res.sendStatus(200)
    } catch(e) {
        res.sendStatus(500)
        throw new Error(e);
    }
})

router.get('/getParticipants', adminAuth, async (req,res,next) => {
    const db = req.app.get("db");
    const allParticipants = await getAllParticipants(db);
    res.json(allParticipants);
})

router.post('/banUser', adminAuth, async (req,res,next) => {
    const db = req.app.get("db")
    const io = req.app.get("socketio")
    const googleId = req.body.googleId
    const socketId = await getSocketId(db, googleId)
    const user = await getUserByGoogleId(db, googleId)
    const recieverFullName = 
            user.firstName[0].toUpperCase() + user.firstName.slice(1) + " " +
            user.lastName[0].toUpperCase() + user.lastName.slice(1)
    const senderFullName = 
            req.user.firstName[0].toUpperCase() + req.user.firstName.slice(1) + " " +
            req.user.lastName[0].toUpperCase() + req.user.lastName.slice(1)
    const logMsg = `${senderFullName}(${req.user.email}) banned ${recieverFullName}.(${user.email})`
    addLog(db, logMsg, "bans")
    banUser(db, googleId)
    if(socketId) {
        io.to(socketId).emit('reloadSiteClients');
    }
    
    res.sendStatus(200)
})

router.post('/unbanUser', adminAuth, async (req,res,next) => {
    const db = req.app.get("db")
    const io = req.app.get("socketio")
    const googleId = req.body.googleId
    const user = await getUserByGoogleId(db, googleId)
    const recieverFullName = 
            user.firstName[0].toUpperCase() + user.firstName.slice(1) + " " +
            user.lastName[0].toUpperCase() + user.lastName.slice(1)
    const senderFullName = 
            req.user.firstName[0].toUpperCase() + req.user.firstName.slice(1) + " " +
            req.user.lastName[0].toUpperCase() + req.user.lastName.slice(1)
    const logMsg = `${senderFullName}(${req.user.email}) unbanned ${recieverFullName}.(${user.email})`
    addLog(db, logMsg, "bans")
    unbanUser(db, googleId)
    io.emit("reloadUnban", googleId)
    res.sendStatus(200)
})

router.post('/slateControl', adminAuth, (req, res, next) => {
    if(req.user && req.user.auth >= 2) {
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
