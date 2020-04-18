const getStream = require('./getStream') 
const getUsers = require('./getUsers')


module.exports = async (db) => {
    const stream = await getStream(db);
    const users = await getUsers(db);
    const participantsIds = stream.participants.map(x => x.googleId);
    let participants = []
    users.forEach((u) => {
        if(participantsIds.includes(u.googleId)) {
            participants.push(u)
        }
    })
    return participants
}