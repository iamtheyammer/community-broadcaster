var express = require('express');
var router = express.Router();

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

router.get('/current-stream', authCheck, function(req, res, next) {
    const db = req.app.get("db")
    async function getData() {
        var arr1 = await db.collection('siteControls').find({}).toArray()
        var arr2 = await db.collection('users').find({}).toArray()
        res.render('admin/home', { title: 'Current Stream', userArr: JSON.stringify(arr2), controlArr: JSON.stringify(arr1), user: JSON.stringify(req.user) });
    } getData()
});

router.get('/upcoming-streams', authCheck, function(req, res, next) {
    res.render('admin/home', { title: 'Upcoming Streams' });
});

router.get('/viewers', authCheck, function(req, res, next) {
    res.render('admin/home', { title: 'Viewers' });
});

module.exports = router;