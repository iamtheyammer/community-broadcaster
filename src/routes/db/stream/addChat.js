const randomstring = require("randomstring")

module.exports = (db, user, message, approved) => {
    const data = {
        message: message,
        chatID: randomstring.generate(),
        userName: user.firstName + " " + user.lastName,
        userGoogleId: user.googleId,
        userChatTag: user.chatTag,
        timestamp: Date.now(),
        flagged: false,
        flagData: {},
        approved: approved
    }
    db.collection("siteControls").updateOne({"identifier": "currentStream"},
        {$push: {liveChats: data}}
    )
    return data;
}