const randomstring = require('randomstring')
const addLog = require('../logs/addLog')

module.exports = (db, data, user) => {
    const streamId = randomstring.generate({
        length: 8,
        charset: 'alphanumeric'
    });

    db.collection("streams").insert({
        name: data.name,
        runner: data.runner,
        startTime: data.date,
        streamId: streamId,
        finished: false,
        active: false,
        chatSettings: {},
        liveChats: [],
        participants: [],
        participantLogs: [],
        streamVideo: ""
    })
    const fullName = 
        user.firstName[0].toUpperCase() + user.firstName.slice(1) + " " +
        user.lastName[0].toUpperCase() + user.lastName.slice(1)
    const msg = `${fullName} (${user.email}) created an upcoming stream: ${streamId}`
    addLog(db, msg, "upcomingStreams")
    return {...data, streamId: streamId}
}