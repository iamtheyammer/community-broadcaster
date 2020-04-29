const getParticipantGoogleId = require('./getParticipantGoogleId')
const addParticipantLog = require("./addParticipantLog")

module.exports = async (db, socketId) => {
    const googleId = await getParticipantGoogleId(db, socketId)
    if(!googleId) {
        return false;
    }
    db.collection("streams").updateOne({"active": true},{ "$pull": {"participants": {googleId: googleId}} } )
    return await addParticipantLog(db, "leave", googleId)
}