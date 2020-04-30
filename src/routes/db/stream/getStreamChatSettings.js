const getStream = require('./getStream')

module.exports = async (db) => {
    const stream = await getStream(db)
    return stream.chatSettings
}