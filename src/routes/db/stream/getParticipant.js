const getStream = require('./getStream');

module.exports = async (req, db, participantId) => {
    const stream = await getStream(db)
    let name;
    if(!stream.participants || stream.participants.length <= 0 ) {
        req.session.participantId = undefined
        return false;
    }
    stream.participants.forEach((p) => {
        if(p.id === participantId) {
            name = p.name
        }
    })
    if(!name) {
        req.session.participantId = undefined
        return false;
    }
    return name;
}