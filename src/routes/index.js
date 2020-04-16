var express = require('express');
var router = express.Router();

const authMeetingStarted = require('./auth/meetingStarted')
const getParticipant = require('./db/stream/getParticipant')

/* GET home page. */
router.get('/', authMeetingStarted, async function(req, res, next) {
  const db = req.app.get('db')
  let displayName = await getParticipant(req, db, req.session.participantId)
  if(!displayName) {
    res.redirect("/name")
  } else {
    async function getData() {
      var tempArr2 = []
      var arr1 = await db.collection('siteControls').find({}).toArray()
      var arr2 = await db.collection('users').find({"auth": 2}).toArray()
      for(var i =0; i < arr2.length; i++) {
        tempArr2.push(arr2[i]._id)
      }
      res.render('index', { title: 'd.tech Community', displayName: displayName, "controlArr": JSON.stringify(arr1), "tokenArr": JSON.stringify(tempArr2)});
    } getData()
  }
});

router.get('/countdown', function(req, res, next) {
  res.render('countdown', { title: 'Countdown' });
});

router.get('/name', authMeetingStarted, async function(req, res, next) {
  const db = req.app.get('db')
  let displayName = await getParticipant(req, db, req.session.participantId)
  res.render('name', { title: 'Name', displayName: displayName ? displayName : ""});
});

router.get('/pendingApproval', function(req, res, next) {
  if(req.user) {
    if(req.user.auth == 1) {
      res.render('pendingApproval',{ title: 'Pending Approval' })
    } else {
      res.redirect('/auth/redirect')
    }
  } else {
    res.redirect('/')
  }
})

module.exports = router;
