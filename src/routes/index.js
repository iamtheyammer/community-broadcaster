var express = require('express');
var router = express.Router();

const authMeetingStarted = require('./auth/meetingStarted')
const getParticipant = require('./db/stream/getParticipant')

/* GET home page. */
router.get('/', authMeetingStarted, async function(req, res, next) {
  const db = req.app.get('db')
  // let displayName = await getParticipant(req, db, req.session.participantId)
  if(!req.user) {
    res.redirect("/check")
  } else {
    if(req.user.auth > 0) {
      async function getData() {
        var tempArr2 = []
        var arr1 = await db.collection('siteControls').find({}).toArray()
        var arr2 = await db.collection('users').find({"auth": 3}).toArray()
        var arr3 = await db.collection('stream').find({"currentStream": true}).toArray()
        var arr4 = await db.collection('users').find({"googleId": req.user.googleId}).toArray()
        for(var i =0; i < arr2.length; i++) {
          tempArr2.push(arr2[i]._id)
        }
        res.render('index/index', { title: 'd.tech Community', "user": JSON.stringify(arr4), "controlArr": JSON.stringify(arr1), "tokenArr": JSON.stringify(tempArr2), "stream": JSON.stringify(arr3)});
      } getData()
    } else {
      res.redirect('auth/redirect')
    }
  }
});

router.get('/countdown', function(req, res, next) {
  res.render('countdown', { title: 'Countdown' });
});

router.get('/check', authMeetingStarted, async function(req, res, next) {
  if(req.user) {
    res.redirect('')
  } else {
    const db = req.app.get('db')
    // let displayName = await getParticipant(req, db, req.session.participantId)
    // res.render('name', { title: 'Name', displayName: displayName ? displayName : ""});
    res.render('name', { title: 'Affiliation Check'});
  }
});

router.get('/pendingApproval', function(req, res, next) {
  if(req.user) {
    if(req.user.auth == 0) {
      res.render('pendingApproval',{ title: 'Pending Approval' })
    } else {
      res.redirect('/auth/redirect')
    }
  } else {
    res.redirect('/')
  }
})

module.exports = router;
