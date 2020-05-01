const express = require('express');
const router = express.Router();
const randomstring = require("randomstring")
const { check } = require('express-validator');
const Filter = require('bad-words'),
    filter = new Filter();

const addChat = require('./db/stream/addChat')
const getStreamChatSettings = require('./db/stream/getStreamChatSettings')
const getSocketId = require('./db/stream/getSocketId')
const getUserLastChatTime = require('./db/users/getUserLastChatTime')

const authCheck = (req, res, next) => {
    if(req.user) {
        if(req.user.auth > 0) {
            next()
        }
    } else {
        res.send(404)
    }
}

router.post('/chat/sendMessage', [
    check('message').escape()
], async (req, res, next) => {
    const db = req.app.get("db")
    const streamChatSettings = await getStreamChatSettings(db)
    if(streamChatSettings.status === "disabled" || req.user.muted) {
        res.sendStatus(200)
        return;
    }
    let userLastChatTime = await getUserLastChatTime(db, req.user.googleId)
    if(userLastChatTime.getTime() + 5000 >= Date.now()) {
        const timeLeft = Math.round(((userLastChatTime.getTime() + 5000) - Date.now()) / 1000)
        res.json({
            timeLeft: timeLeft,
            type: "cooldown"
        })
        return;
    }
    const io = req.app.get("socketio")
    const adminOnly = streamChatSettings.status === "private" ? true : false
    const chatData = addChat(db, req.user, req.body.message, adminOnly)
    db.collection("users").updateOne({googleId: req.user.googleId}, {$set: {lastChatTime: new Date()}})
    io.emit("newChatAdmin", {
        message: chatData.message.replace(/&/g, "&amp;"),
        userName: chatData.userName,
        userChatTag: chatData.userChatTag,
        timestamp: chatData.timestamp,
        chatID: chatData.chatID
    })

    if(adminOnly) {
        res.json({
            message: filter.clean(chatData.message).replace(/&/g, "&amp;"),
            userName: chatData.userName,
            userChatTag: chatData.userChatTag,
            timestamp: chatData.timestamp,
            chatID: chatData.chatID,
            type: "chat"
        })
    } else {
        io.emit("newChat", {
            message: filter.clean(chatData.message).replace(/&/g, "&amp;"),
            userName: chatData.userName,
            userChatTag: chatData.userChatTag,
            timestamp: chatData.timestamp,
            chatID: chatData.chatID
        })
        res.sendStatus(200)
    }
})

router.post('/errorReport', authCheck, (req, res, next) => {
    var db = req.app.get('db')
    var errorTitle;
    if(req.body.errorType == '1') {
        errorTitle = "Video is buffering excessively"
    } else if(req.body.errorType == '2') {
        errorTitle = "Video not loading"
    } else if(req.body.errorType == '3') {
        errorTitle = "Audio cutting out"
    } else if(req.body.errorType == '4') {
        errorTitle = "Video and Audio not aligned"
    } else if(req.body.errorType == '5') {
        errorTitle = "Website not working"
    } else if(req.body.errorType == '6') {
        errorTitle = "Chat not working"
    } else {
        res.sendStatsu(500)
        return;
    }
    db.collection('errors').insertOne({
        "errorTitle": errorTitle,
        "errorCode": req.body.errorType,
        "errorID": randomstring.generate(),
        "errorMeta": {
            "user": req.user.googleId,
            "user_firstName": req.user.firstName,
            "user_lastName": req.user.lastName,
            "user_email": req.user.email,
            "timestamp": Date.now()
        }
    })
    res.sendStatus(200)
})

module.exports = router;
