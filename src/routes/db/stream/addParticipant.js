module.exports = (db, socketId, googleId) => {
    db.collection("stream").updateOne({},{ "$pull": {"participants": {googleId: googleId}} } )
    db.collection("stream").updateOne({},
        { "$push": {"participants": {googleId: googleId, socketId: socketId}} }  )
}