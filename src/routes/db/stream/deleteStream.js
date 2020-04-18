module.exports = (db, streamId) => {
    db.collection("upcomingStreams").deleteOne({
        streamId: streamId
    })
}