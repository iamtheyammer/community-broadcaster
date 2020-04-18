module.exports = async (db) => {
    const getUpcomingStreams  = () => {
        return new Promise((resolve,reject) => {
            db.collection('upcomingStreams').find({}).toArray((err,data) => {
                err ? reject(err) : resolve(data)
            })
        })
    }

    const upcomingStreams = await getUpcomingStreams();
    return upcomingStreams
}