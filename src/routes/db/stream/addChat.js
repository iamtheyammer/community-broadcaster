const randomstring = require("randomstring")

module.exports = (db, user, message, adminOnly) => {
    const data = {
        message: message,
        chatID: randomstring.generate(),
        userName: user.firstName + " " + user.lastName,
        userGoogleId: user.googleId,
        userChatTag: user.chatTag,
        timestamp: Date.now(),
        flagged: false,
        flagData: {},
        adminOnly: adminOnly
    }
    db.collection("streams").updateOne({"active": true},
        {$push: {liveChats: data}}
    )
    return data;
}