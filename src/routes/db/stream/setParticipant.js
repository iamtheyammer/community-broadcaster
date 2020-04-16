module.exports = (db, name, participantId) => {
    db.collection("stream").updateOne({},
    { 
        "$push": {
            "participants": {
                name: name,
                id: participantId
            }
        } 
    })
}