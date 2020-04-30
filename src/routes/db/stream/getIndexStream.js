const getStream = require('./getStream') 
const getParticipantCount = require('./getParticipantCount')
const Filter = require('bad-words'),
    filter = new Filter();

module.exports = async (db, user) => {
    const stream = await getStream(db);
    const participantCount = await getParticipantCount(db)
    let streamObj = {}
    let chats = []
    if(stream.liveChats && stream.liveChats.length > 0) {
        stream.liveChats = stream.liveChats.filter(x => ! x.adminOnly || x.userGoogleId === user.googleId)
        chats = stream.liveChats.map((x) => {
            return {message: filter.clean(x.message), userName: x.userName, userChatTag: x.userChatTag, timestamp: x.timestamp}
        })
    }
    streamObj.liveChats = chats
    streamObj.participantCount = participantCount
    streamObj.chatSettings = stream.chatSettings
    streamObj.name = stream.name
    streamObj.runner = stream.runner
    return streamObj
}