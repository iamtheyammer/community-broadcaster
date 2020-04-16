const router = require('express').Router();
const passport = require('passport');

const authCheck = (req, res, next) => {
    if(!req.user) {
        res.redirect('/')
    } else {
        next();
    }
}

const meetingStarted = (req,res,next) => {
    if(true) {
        next()
    } else {
        res.redirect("/countdown")
    }
}

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/googleRedirect',  passport.authenticate('google'), (req, res, next) => {
    if(req.user) {
        if(req.user.auth > 1) {
            if(req.user.auth == 2) {
                res.redirect('/admin/current-stream')
            }
        } else {
            res.redirect('/pendingApproval')
        }
    } else {
        res.redirect('/')
    }
})

router.get('/redirect', (req, res, next) => {
    if(req.user) {
        if(req.user.auth > 1) {
            if(req.user.auth == 2) {
                res.redirect('/admin/current-stream')
            }
        } else {
            res.redirect('/pendingApproval')
        }
    } else {
        res.redirect('/')
    }
})

router.get('logout', (req, res, next) => {
    req.logout()
    res.redirect('/')
})

module.exports = router;