module.exports = (db, googleId) => {
    db.collection("stream").updateOne({},
    { "$addToSet": {"participants": {googleId: googleId}} }  )
}