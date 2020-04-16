
var token = "I needs to make one"

var CurslateState = false

var dataConnections = []
var labelsConnections = []

function reloadSiteClients() {
    socket.emit('reloadSiteClients', token);
}

function reloadStreamClients() {
    socket.emit('reloadStreamClients', token);
}

function sendAlert() {
    var input = $('.admin-home-wrapper-send-message input[type="text"]').val()
    var data = [token, {"input": input}]
    socket.emit('siteAlert', data)
}

$(document).ready(() => {
    switch(window.location.pathname) {
        case "/admin/current-stream":
          $(".nav-container .current-streams-link").addClass("active")
          break;
        case "/admin/upcoming-streams":
          $(".nav-container .upcoming-streams-link").addClass("active")
          break;
        case "/admin/viewers":
          $(".nav-container .viewers-link").addClass("active")
          break;
      }
})

findDBSlateState()

function slateState(stateSelection) {
  var selection = $('.slateSelectionDrop').val()
  var state = stateSelection
  var data = [token, {"state": state, selection}]
  socket.emit('slateControl', data)
  $.ajax({
    url: "/api/slateControl",
    method: "POST",
    data: {token, state, selection},
    success: function(result) {
      log(result)
      CurslateState = !CurslateState
    }
  })

}

function findDBSlateState() {
  for(var i = 0; i < siteControls.length; i++) {
    if(siteControls[i].identifier == "slate") {
      CurslateState = siteControls[i].state
    }
  }
}

var chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)'
};

var ctx = document.getElementById('usersConnected').getContext('2d');
var cntChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      data: dataConnections,
      label: "Currently Connected Users",
      backgroundColor: chartColors.blue,
      borderColor: chartColors.blue,
      fill: false,
    }],
    labels: labelsConnections,
  },

});

socket.on('clientChange', function(data){
  log(data)
  $('.clientsConnected').text('Clients Connected: ' +  data[0]);
  if(dataConnections.length == 10) {
    dataConnections.splice(0, 1);
    labelsConnections.splice(0, 1);
  }
  dataConnections.push(data[0])
  if(data[1] == null) {
    labelsConnections.push("Client Reload")
  } else {
    labelsConnections.push(moment(data[1]).format('HH:mm:ss'))
  }
  cntChart.update();
})

for(var i = 0; i < siteControls.length; i++) {
  if(siteControls[i].identifier == "connectedClients") {
    $('.clientsConnected').text('Clients Connected: ' + siteControls[i].clientsConnected);  
    if(dataConnections.length == 10) {
      dataConnections.splice(0, 1);
      labelsConnections.splice(0, 1);
    }
    dataConnections.push(siteControls[i].clientsConnected)
    if(siteControls[i].lastchanged == null) {
      labelsConnections.push("Client Reload")
    } else {
      labelsConnections.push(moment(siteControls[i].lastchanged).format('HH:mm:ss'))
    }
    cntChart.update();
  }
}