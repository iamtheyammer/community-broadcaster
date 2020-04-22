const express = require('express');
const router = express.Router();
const randomstring = require("randomstring")
const { check } = require('express-validator');

const addChat = require('./db/stream/addChat')

router.post('/chat/sendMessage', [
    check('message').escape()
], (req, res, next) => {
    const db = req.app.get("db")
    const io = req.app.get("socketio")
    const approved = true; // Add approval mode
    const chatData = addChat(db, req.user, req.body.message, approved)
    console.log(chatData)
    io.emit("newChat", {
        message: chatData.message.replace(/&/g, "&amp;"),
        userName: chatData.userName,
        userChatTag: chatData.userChatTag,
        timestamp: chatData.timestamp
    })
    res.sendStatus(200)
})

module.exports = router;
