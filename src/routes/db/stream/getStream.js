module.exports = async (db) => {
    const getStream  = () => {
        return new Promise((resolve,reject) => {
            db.collection("streams").find({"active": true}).toArray((err,data) => {
                resolve(data[0])
            })
        })
    }
    let stream = {}
    try {
        stream = await getStream();
    } catch (e) {
        return true;
    }
    console.log("STREAM", stream)
    return stream
}