
// Collecting data from DB

let freshman = 0
let sophomores = 0
let juniors = 0
let seniors = 0
let faculty = 0
let other = 0
for(var i = 0; i < users.length; i++) {
    if(users[i].schoolAssociation != "none") {
        if(users[i].schoolAssociation == "faculty") {
            faculty++
        } else {
            if(users[i].grade == 9) {
                freshman++
            }
            if(users[i].grade == 10) {
                sophomores++
            }
            if(users[i].grade == 11) {
                juniors++
            }
            if(users[i].grade == 12) {
                seniors++
            }
        }
    } else {
        other++
    }
}

// Graph Rendering

let pieGraphData = [freshman, sophomores, juniors, seniors, faculty, other]

var tempData = [0, 20, 10, 50, 70, 150, 20, 60, 40, 10, 0]
var tempData2 = [0, 70, 20, 10, 50, 250, 50, 20, 80, 20, 0]

var tempLabelsConnected = [0, 20, 10, 50, 100, 150, 20, 60, 40, 10, 0]
var tempStudents = ["Freshmen", "Sophomores", "Juniors", "Seniors", "Faculty", "Other"]

Chart.plugins.unregister(ChartDataLabels);

setTimeout(function(){
  var ctx = document.getElementById('viewersGraph').getContext('2d');
  var pieCTX = document.getElementById('demographicsPie').getContext('2d');

  var myPieChart = new Chart(pieCTX, {
    type: 'pie',
    plugins: [ChartDataLabels],
    data: { 
      datasets: [{
        data: pieGraphData,
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
                return value;
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
