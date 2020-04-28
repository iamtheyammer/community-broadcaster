module.exports = async (db) => {
    const getStream  = () => {
        return new Promise((resolve,reject) => {
            db.collection("siteControls").find({"identifier": "currentStream"}).toArray((err,data) => {
                err ? reject(err) : resolve(data)
            })
        })
    }

    const stream = await getStream();
    return stream[0]
}