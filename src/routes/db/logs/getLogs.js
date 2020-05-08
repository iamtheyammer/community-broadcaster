module.exports = async (db) => {
    const getLogs  = () => {
        return new Promise((resolve,reject) => {
            db.collection('logs').find({}).toArray((err,data) => {
                err ? reject(err) : resolve(data)
            })
        })
    }

    const logs = await getLogs();
    return logs
}