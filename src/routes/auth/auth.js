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
       
        // Add or Update associated IP Addresses

        const db = req.app.get("db")
        if(req.user.associatedIPs.length > 0 ) {
            for(var i = 0; i < req.user.associatedIPs.length; i++) {
                if(req.user.associatedIPs[i] == req.headers['x-forwarded-for']) {
                    console.log("Found User IP")
                    return true;
                } else {
                    if(i = req.user.associatedIPs.length) {
                        console.log("Cannot find user IP, adding to DB")
                        db.collection("users").updateOne({"googleId": req.user.googleId}, {$push: {
                            associatedIPs: req.headers['x-forwarded-for']
                        }})
                    }
                    
                }
            }
        } else {
            console.log("no associated IP addresses; adding new IP addresses")
            db.collection("users").updateOne({"googleId": req.user.googleId}, {$push: {
                associatedIPs: req.headers['x-forwarded-for']
            }})
        }

        if(req.user.auth > 0) {
            if(req.user.auth == 1) {
                res.redirect('/')
            }
            if(req.user.auth == 2 || req.user.auth == 3) {
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
        if(req.user.auth > 0) {
            if(req.user.auth == 1) {
                res.redirect('/')
            }
            if(req.user.auth == 2 || req.user.auth == 3) {
                res.redirect('/admin/current-stream')
            }
        } else {
            res.redirect('/pendingApproval')
        }
    } else {
        res.redirect('/')
    }
})

router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/')
})

module.exports = router;