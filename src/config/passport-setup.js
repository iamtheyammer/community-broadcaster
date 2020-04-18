const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
})

passport.use(
    new GoogleStrategy({
        callbackURL:'/auth/googleRedirect',
        clientID:'363354508586-gu3j3sblfdk2po75ihei6hap6auhht5c.apps.googleusercontent.com',
        clientSecret:'IhWCd29eHWqNA8-fUJJXUyeH'
    }, (accessToke, refreshToken, profile, email, done) => {
        console.log(email)
        User.findOne({googleId: email.id}).then((currentUser) => {
            if(currentUser) {
                console.log('existing user found: ' + currentUser)
                done(null, currentUser)
            } else {
                if(email.emails[0].value.toLowerCase().split("@").pop() == "dtechhs.org") {
                    var grade;
                    var schoolAssociation;
                    if(email.emails[0].value.toLowerCase().substring(email.emails[0].value.toLowerCase().length - 14).substring(0,2) == 23) {
                        console.log("Freshman Email")
                        grade = 9
                        schoolAssociation = "student"
                    }
                    if(email.emails[0].value.toLowerCase().substring(email.emails[0].value.toLowerCase().length - 14).substring(0,2) == 22) {
                        console.log("Sophomore Email")
                        grade = 10
                        schoolAssociation = "student"
                    }
                    if(email.emails[0].value.toLowerCase().substring(email.emails[0].value.toLowerCase().length - 14).substring(0,2) == 21) {
                        console.log("Junior Email")
                        grade = 11
                        schoolAssociation = "student"
                    }
                    if(email.emails[0].value.toLowerCase().substring(email.emails[0].value.toLowerCase().length - 14).substring(0,2) == 20) {
                        console.log("Senior Email")
                        grade = 12
                        schoolAssociation = "student"
                    }
                    if(isNaN(email.emails[0].value.toLowerCase().substring(email.emails[0].value.toLowerCase().length - 14).substring(0,2))) {
                        grade = 0
                        schoolAssociation = "faculty"
                    }
                    new User({
                        email: email.emails[0].value.toLowerCase(),
                        googleId: email.id,
                        firstName: email.name.givenName.toLowerCase(),
                        lastName: email.name.familyName.toLowerCase(),
                        authenticationFrom: "oauth20",
                        googleProfilePicture: email.photos[0].value,
                        auth: 1,
                        grade: grade,
                        schoolAssociation: schoolAssociation,
                        associatedIPs: [],
                        dateCreated: Date.now()
                    }).save().then((newUser) => {
                        console.log('New User Created: ' + newUser)
                        done(null, newUser)
                    })
                } else {
                    new User({
                        email: email.emails[0].value.toLowerCase(),
                        googleId: email.id,
                        firstName: email.name.givenName.toLowerCase(),
                        lastName: email.name.familyName.toLowerCase(),
                        authenticationFrom: "oauth20",
                        googleProfilePicture: email.photos[0].value,
                        auth: 0,
                        grade: 0,
                        schoolAssociation: "none",
                        associatedIPs: [],
                        dateCreated: Date.now()
                    }).save().then((newUser) => {
                        console.log('New User Created: ' + newUser)
                        done(null, newUser)
                    })
                }
            }
        }) 
    })
)