const addParticipantLog = require("./addParticipantLog")
const getSocketId = require("./getSocketId")

module.exports = async (db, io, socketId, googleId) => {
    const oldSocketId = await getSocketId(db, googleId)
    if(oldSocketId) {
        io.to(oldSocketId).emit('newLogin');
        const participantLog = await addParticipantLog(db, "leave", googleId)
        io.emit('participantLogsChange', participantLog)
    }
    db.collection("streams").updateOne({"active": true},{ "$pull": {"participants": {googleId: googleId}} } )
    db.collection("streams").updateOne({"active": true},
        { "$push": {"participants": {googleId: googleId, socketId: socketId}} }  )
    return await addParticipantLog(db, "join", googleId)
}