const getStream = require('./getStream') 
const getParticipantCount = require('./getParticipantCount')
const Filter = require('bad-words'),
    filter = new Filter();

module.exports = async (db) => {
    const stream = await getStream(db);
    const participantCount = await getParticipantCount(db)
    let streamObj = {}
    let chats = []
    if(stream.liveChats && stream.liveChats.length > 0) {
        chats = stream.liveChats.map((x) => {
            return {message: filter.clean(x.message), userName: x.userName, userChatTag: x.userChatTag, timestamp: x.timestamp}
        })
    }
    
    streamObj.liveChats = chats
    streamObj.participantCount = participantCount
    streamObj.chatSettings = stream.chatSettings
    streamObj.streamName = stream.streamName
    streamObj.streamRunner = stream.streamRunner

    return streamObj
}