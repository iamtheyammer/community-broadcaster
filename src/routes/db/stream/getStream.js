module.exports = async (db) => {
    const getStream  = () => {
        return new Promise((resolve,reject) => {
            db.collection("streams").find({"active": true}).toArray((err,data) => {
                err ? reject(err) : resolve(data)
            })
        })
    }

    const stream = await getStream();
    return stream[0]
}