const MongoClient = require('mongodb').MongoClient;

const addLog = require('./addLog')


module.exports = (user) => {
    MongoClient.connect("mongodb://localhost:27017", function(err, client) {
        if(err) throw err
        var db = client.db('DesignTechHS');
        const fullName = 
            user.firstName[0].toUpperCase() + user.firstName.slice(1) + " " +
            user.lastName[0].toUpperCase() + user.lastName.slice(1)
        const logMsg = `${fullName}(${user.email}) logged in for the first time.`
        addLog(db, logMsg, "firstLogin")
    })
}