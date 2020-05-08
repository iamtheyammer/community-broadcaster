module.exports = (db, msg, category) => {
    db.collection('logs').insert({
        message: msg,
        category: category,
        time: Date.now()
    })
}