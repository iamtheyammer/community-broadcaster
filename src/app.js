const dotenv = require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const mongoose = require('mongoose')
const flash = require('connect-flash');
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const colors = require("colors")

const passportSetup = require('./config/passport-setup')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth/auth');
var apiRouter = require('./routes/api')
var adminRouter = require('./routes/admin/admin')

console.log('    ')

mongoose.connect('mongodb://localhost:27017/DesignTechHS', {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    console.log('    ')
    console.log(' DB Alert '.bgRed.white.bold + '  There was an issue connecting to the database.'.bold.red)
    console.log('    ')
    console.log(' DB Alert '.bgRed.white.bold + '  DB error has been added to logs, shutting down server'.bold.red)
    console.log('    ')
    console.log(err)
    server.close()
  } else {
    console.log('    ')
    console.log('DesignTechHS Database Online')
    console.log('DesignTechHS Database Connection Successful')
    console.log('    ')
  }
  app.set('db', client)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'bin')));
app.use(express.static(path.join(__dirname, '..', 'libs')));

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['broadcastingdtechcommunity']
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api', apiRouter)
app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = 3000
const server = app.listen(port, () => console.log('DTECH Community webserver started on port '+ port + "!"));
console.log('DTECH Community is now accessible from https://community.designtechhs.com')

const io = require('socket.io').listen(server);
app.set('socketio', io)

let connectedUsers = 0

io.on('connection', function(socket){
  connectedUsers++
  let dTS = [connectedUsers, Date.now()]
  io.emit('clientChange', dTS)
  mongoose.connect('mongodb://localhost:27017/DesignTechHS', {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    client.collection('siteControls').updateOne({"identifier": "connectedClients"}, {$set: {
      clientsConnected: connectedUsers,
      lastchanged: Date.now()
    }})
  });
  socket.on('disconnect', function(){
    connectedUsers--
    let dTS = [connectedUsers, Date.now]
    io.emit('clientChange', dTS)
    mongoose.connect('mongodb://localhost:27017/DesignTechHS', {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      client.collection('siteControls').updateOne({"identifier": "connectedClients"}, {$set: {
        clientsConnected: connectedUsers,
        lastchanged: Date.now()
      }})
    });
  });
  socket.on('reloadStreamClients', function(msg){
    console.log('message: ' + msg);
    io.emit('reloadStreamClients', msg)
  });
  socket.on('reloadSiteClients', function(msg){
    console.log('message: ' + msg);
    io.emit('reloadSiteClients', msg)
  });
  socket.on('siteAlert', function(msg){
    console.log('message: ' + msg);
    io.emit('siteAlert', msg)
  });
  socket.on('slateControl', function(msg){
    console.log('message: ' + msg);
    io.emit('slateControl', msg)
  });
});

module.exports = app;
