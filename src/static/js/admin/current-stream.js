
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

function findDBSlateState() {
  for(var i = 0; i < siteControls.length; i++) {
    if(siteControls[i].identifier == "slate") {
      CurslateState = siteControls[i].state
    }
  }
}

var tempData = [0, 20, 10, 50, 70, 150, 20, 60, 40, 10, 0]
var tempData2 = [0, 70, 20, 10, 50, 250, 50, 20, 80, 20, 0]
var tempLabelsConnected = [0, 20, 10, 50, 100, 150, 20, 60, 40, 10, 0]
var tempStudents = ["Freshman", "Sophomores", "Juniors", "Seniors", "Faculty", "Other"]

Chart.plugins.unregister(ChartDataLabels);

setTimeout(function(){
  var ctx = document.getElementById('viewersGraph').getContext('2d');
  var pieCTX = document.getElementById('demographicsPie').getContext('2d');

  var data = [10, 50, 30, 10, 50]

  var myPieChart = new Chart(pieCTX, {
    type: 'pie',
    plugins: [ChartDataLabels],
    data: { 
      datasets: [{
        data: data,
        backgroundColor: [
          "#d8deff",
          "#c8d0ff",
          "#a8b4ff",
          "#8999ff",
          "#5d75ff"
        ],
        hoverBackgroundColor: [
          "#aeb6e8",
          "#919bd8",
          "#7984d1",
          "#5260bf",
          "#2d43bf"
        ]
      }],
      labels: tempStudents,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        // display: false
        position: "left"
      },
      tooltips: {
          enabled: false
      },
      plugins: {
          // Change options for ALL labels of THIS CHART
          datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                let percentage = (value*100 / sum).toFixed(2);
                let final = percentage.substring(0, percentage.length - 3) + "%"
                return final;
              },
              color: '#fff',
              anchor: 'end',
              align: "start",
              offset: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              hoverBackgroundColor: '#000000',
              borderRadius: 5,
              padding: {
                left: 10,
                right: 10
              }
          }
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
    }
  });

  var cntChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        data: tempData,
        label: "Currently Connected Users",
        backgroundColor: "RGBA(38, 199, 240, 0.7)",
        borderColor: "RGBA(93, 117, 255, 0)",
      },{
        data: tempData2,
        label: "Currently Connected Users",
        backgroundColor: "RGBA(240, 80, 39, 0.5)",
        borderColor: "RGBA(93, 117, 255, 0)",
      }],
      labels: tempLabelsConnected,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: false,
      legend: {
        display: false
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes : [{
            gridLines : {
                  display : false
            }
        }],
        yAxes: [{
            gridLines : {
                  // display : false
                  color: "#f4f4f4"
            }
        }]
    },
    elements: {
        point:{
            radius: 0
        }
      }
    }
  
  });
}, 1000)

// Functions

function updateDashboardSlateState(stateSelection) {
  if(stateSelection) {
    $('.slS').text("ON")
  } else {
    $('.slS').text("OFF")
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

// Websockets

socket.on('participantsChange', function(count){
  log(count)
  $('.clvv').text(count)
})

socket.on('clientChange', function(data){
  log(data)
  $('.csv').text(data);
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
}, 1000)

// Switches

$('.currentStream-wrapper-body-s3-object-body-switchWrapper').click(function(){
  $(this).toggleClass('active')
})

$('#slateControl').click(function(){
  if($(this).hasClass('active')) {
    slateState(true)
  } else {
    slateState(false)
  }
})

$('#reloadStreamClients').click(function(){
  socket.emit('reloadStreamClients', token);
  setTimeout(function(){
    $('#reloadStreamClients').removeClass("active")
  }, 2000)
})

$('#reloadSiteClients').click(function(){
  socket.emit('reloadSiteClients', token);
  setTimeout(function(){
    $('#reloadSiteClients').removeClass("active")
  }, 2000)
})

$('#logoutStreamClients').click(function(){
  socket.emit('logoutAllStreamClients', token);
  setTimeout(function(){
    $('#logoutStreamClients').removeClass("active")
  }, 2000)
})