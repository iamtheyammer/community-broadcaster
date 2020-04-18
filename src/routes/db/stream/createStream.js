const randomstring = require('randomstring')

module.exports = (db, data) => {
    const streamId = randomstring.generate({
        length: 8,
        charset: 'alphanumeric'
    });
    db.collection("upcomingStreams").insert({
        name: data.name,
        startTime: data.date,
        streamId: streamId
    })
    return {...data, streamId: streamId}
}