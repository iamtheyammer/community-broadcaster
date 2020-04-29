const addParticipantLog = require("./addParticipantLog")

module.exports = async (db, socketId, googleId) => {
    db.collection("streams").updateOne({"active": true},{ "$pull": {"participants": {googleId: googleId}} } )
    db.collection("streams").updateOne({"active": true},
        { "$push": {"participants": {googleId: googleId, socketId: socketId}} }  )
    return await addParticipantLog(db, "join", googleId)
}