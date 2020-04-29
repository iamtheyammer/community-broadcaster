var express = require('express');
var router = express.Router();

const getAllParticipants = require('../db/stream/getAllParticipants')
const getBannedUsers = require('../db/users/getBannedUsers')
const getUsers = require('../db/users/getUsers')
const getLogs = require('../db/logs/getLogs')
const getStream = require('../db/stream/getStream')
const getParticipantLogs = require('../db/stream/getParticipantLogs')

const authCheck = (req, res, next) => {
    if(req.user) {
        if(req.user.auth >= 2) {
            next()
        } else {
            res.redirect('/auth/redirect')
        }
    } else {
        res.redirect('/')
    }
}

const getUpcomingStreams = require('../db/stream/getUpcomingStreams')

router.get('/betaTesting', authCheck, (req, res, next) => {
    res.render('admin/betaTestPage')
})

router.get('/current-stream', authCheck, function(req, res, next) {
    const db = req.app.get("db")
    async function getData() {
        var arr1 = await db.collection('siteControls').find({}).toArray()
        var arr2 = await db.collection('users').find({}).toArray()
        var dataTracking = await db.collection('data_tracking').find({"ident": "viewers"}).toArray()
        var arr3 = await getStream(db)
        var arr4 = await getAllParticipants(db)
        res.render('admin/home', { title: 'Current Stream', viewersArr: JSON.stringify(dataTracking), userArr: JSON.stringify(arr2), controlArr: JSON.stringify(arr1), user: JSON.stringify(req.user), stream: JSON.stringify(arr3), allParticipants: JSON.stringify(arr4) });
    } 
    getData()
});

router.get('/chat-moderation', authCheck, function(req, res, next) {
    const db = req.app.get("db")
    async function getData() {
        var arr1 = await db.collection('siteControls').find({}).toArray()
        var arr2 = await db.collection('users').find({}).toArray()
        var arr3 = await getStream(db)
        const allParticipants = await getAllParticipants(db)
        var arr4 = await getAllParticipants(db)
        res.render('admin/pages/chatMod', { title: 'Current Stream', allParticipants: JSON.stringify(allParticipants), userArr: JSON.stringify(arr2), controlArr: JSON.stringify(arr1), user: JSON.stringify(req.user), stream: JSON.stringify(arr3), allParticipants: JSON.stringify(arr4) });
    } 
    getData()
});

router.get('/upcoming-streams', authCheck, async function(req, res, next) {
    const db = req.app.get('db')
    let upcomingStreams = await getUpcomingStreams(db)
    res.render('admin/home', { title: 'Upcoming Streams', upcomingStreams:  JSON.stringify(upcomingStreams)});
});

router.get('/viewers', authCheck, async function(req, res, next) {
    const db = req.app.get('db')
    const allParticipants = await getAllParticipants(db)
    const participantLogs = await getParticipantLogs(db)
    res.render('admin/home', { title: 'Viewers', allParticipants: JSON.stringify(allParticipants), participantLogs: JSON.stringify(participantLogs) });
});

router.get('/users', authCheck, async function(req, res, next) {
    const db = req.app.get('db')
    const users = await getUsers(db)
    res.render('admin/home', { title: 'Users', users: JSON.stringify(users)});
});

router.get('/logs', authCheck, async function(req, res, next) {
    const db = req.app.get('db')
    const logs = await getLogs(db)
    res.render('admin/home', { title: 'Logs', logs: JSON.stringify(logs)});
});

module.exports = router;
