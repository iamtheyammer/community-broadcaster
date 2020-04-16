module.exports = (db, name, participantId) => {
    db.collection("stream").updateOne({
        participants: {$elemMatch: {id: participantId}}
    },
    { "$set": {"participants.$.name": name} }
    )
}