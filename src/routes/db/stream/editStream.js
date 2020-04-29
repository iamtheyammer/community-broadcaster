const randomstring = require('randomstring')
const addLog = require('../logs/addLog')

module.exports = (db, data, user) => {
    db.collection("streams").updateOne({
        streamId: data.streamId
    }, {$set: {
        name: data.name,
        runner: data.runner,
        startTime: data.date
    }})

    const fullName = 
        user.firstName[0].toUpperCase() + user.firstName.slice(1) + " " +
        user.lastName[0].toUpperCase() + user.lastName.slice(1)
    const msg = `${fullName} (${user.email}) made made changes to an upcoming stream: ${data.streamId}`
    addLog(db, msg, "upcomingStreams")
    return data;
}