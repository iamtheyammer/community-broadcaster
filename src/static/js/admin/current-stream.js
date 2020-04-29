
var token = user.googleId

var CurslateState = false

var dataConnections = []
var labelsConnections = []

function sendAlert() {
    var input = $('.alertTXT').val()
    var data = [token, {"input": input}]
    socket.emit('siteAlert', data)
    $('.alertTXT').val('')
}

function sendNotification() {
  var input = $('.notifTXT').val()
  var data = [token, {"input": input}]
  socket.emit('siteNotification', data)
  $('.notifTXT').val('')
}

findDBSlateState()

function slateState(stateSelection) {
  var selection = $('.slateSelectionDrop').val()
  var state = stateSelection
  var data = [token, {"state": state, selection}]
  updateDashboardSlateState(stateSelection)
  socket.emit('slateControl', data)
  $.ajax({
    url: "/admin/api/slateControl",
    method: "POST",
    data: {token, state, selection},
    success: function(result) {
      log(result)
      CurslateState = !CurslateState
    }
  })

}

function endCurrentStream() {
  if(window.prompt('To confirm enter "END STREAM"') == "END STREAM") {
    $.ajax({
      url: "/admin/api/endStream",
      method: "POST",
      success: function(result) {
        window.alert('Successfully Ended the Current Stream')
      }
    })
  } else {
    window.alert('Unable to verify.')
  }
}

function findDBSlateState() {
  for(var i = 0; i < siteControls.length; i++) {
    if(siteControls[i].identifier == "slate") {
      CurslateState = siteControls[i].state
    }
  }
}

// Functions

function updateDashboardSlateState(stateSelection) {
  if(stateSelection) {
    $('.slS').text("ON")
    $('#slateControl').addClass('active')
  } else {
    $('.slS').text("OFF")
    $('#slateControl').removeClass('active') 
  }
}


// Set Values from DB

$('.clvv').text(stream.participants.length)

if(siteControls[0].state) {
  $('.slS').text("ON")
  $('#slateControl').addClass('active')
} else {
  $('.slS').text("OFF")
  $('#slateControl').removeClass('active')
}

let dbVal;
if(siteControls[0].slateType == 1) {
  dbVal = "Bars and Tones"
}
if(siteControls[0].slateType == 2) {
  dbVal = "Splash"
}
if(siteControls[0].slateType == 3) {
  dbVal = "Maintainance"
}
$('.slateSelectionDrop').val(dbVal)

// Websockets

socket.on('participantsChange', function(count){
  log(count)
  $('.clvv').text(count)
})

socket.on('clientChange', function(data){
  log(data)
  $('.csv').text(data);
})

socket.on('slateControl', function(data){
  log(data)
  updateDashboardSlateState(data[1].state)
  $('.slateSelectionDrop').val(data[1].selection)
})

// VideoJS

setTimeout(function(){
  var player = videojs('#my-video');
  var videoPlay = player.play();
  if(videoPlay !== undefined) {
    videoPlay.then(_ => {
      player.play();
      player.muted(false);
    }).catch(error => {
      player.play();
      player.muted(false);
    })
  }
  if(!player.readyState()) {
    siteAlert(["local", {"input": "Unable to load livestream!"}])
  }
}, 1000)

// Switches

$('.currentStream-wrapper-body-s3-object-body-switchWrapper').click(function(){
  $(this).toggleClass('active')
})

$('#slateControl').click(function(){
  if($(this).hasClass('active')) {
    siteNotification(["local", {"input": "You have successfully turned on the slate"}])
    slateState(true)
  } else {
    slateState(false)
    siteNotification(["local", {"input": "You have successfully turned off the slate"}])
  }
})

$('#reloadStreamClients').click(function(){
  socket.emit('reloadStreamClients', token);
  setTimeout(function(){
    $('#reloadStreamClients').removeClass("active")
    siteNotification(["local", {"input": "You have successfully reloaded all stream clients"}])
  }, 2000)
})

$('#reloadSiteClients').click(function(){
  siteNotification(["local", {"input": "Now reloading all site clients, expect reload."}])
  setTimeout(function(){
    socket.emit('reloadSiteClients', token);
    $('#reloadSiteClients').removeClass("active")
  }, 2000)
})

$('#logoutStreamClients').click(function(){
  socket.emit('logoutAllStreamClients', token);
  siteNotification(["local", {"input": "Now logging out all stream clients."}])
  setTimeout(function(){
    $('#logoutStreamClients').removeClass("active")
  }, 2000)
})

// Selects

$('.slateSelectionDrop').change(() => {
  siteNotification(["local", {"input": "You have successfully changed the slate's image"}])
  slateState(true)
})

// Stream Checks

if(stream.liveStream) {
  $('.tahj').hide()
} else {
  $(".currentStream-wrapper").hide()
}