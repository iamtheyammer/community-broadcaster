const addParticipantLog = require("./addParticipantLog")

module.exports = async (db, socketId, googleId) => {
    db.collection("siteControls").updateOne({"identifier": "currentStream"},{ "$pull": {"participants": {googleId: googleId}} } )
    db.collection("siteControls").updateOne({"identifier": "currentStream"},
        { "$push": {"participants": {googleId: googleId, socketId: socketId}} }  )
    return await addParticipantLog(db, "join", googleId)
}