
let DB_streamCount = []
let DB_siteCount = []

let currentSiteCount = viewersArr.data.site_clients[viewersArr.data.site_clients.length - 1]
let currentStreamCount = viewersArr.data.stream_clients[viewersArr.data.stream_clients.length - 1]

// DB Pulling

for(var i = viewersArr.data.stream_clients.length - 30; i < viewersArr.data.stream_clients.length; i++) {
    DB_streamCount.push(viewersArr.data.stream_clients[i])
}

for(var i = viewersArr.data.site_clients.length - 30; i < viewersArr.data.site_clients.length; i++) {
    DB_siteCount.push(viewersArr.data.site_clients[i])
}

// SocketIO Functions

function updateStreamGraph(count) {
    tempData.splice(0,1)
    tempData2.splice(0,1)
    tempData.push(count)
    tempData2.push(currentSiteCount)
    currentStreamCount = count
    cntChart.update()
}

function updateSiteClientsGraph(count) {
    tempData.splice(0,1)
    tempData2.splice(0,1)
    tempData.push(currentStreamCount)
    tempData2.push(count)
    currentSiteCount = count
    cntChart.update()
}

// Graph Rendering

var tempData = []
var tempData2 = []

tempData = DB_streamCount
tempData2 = DB_siteCount

var tempLabelsConnected = [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", ]

var ctx = document.getElementById('viewersGraph').getContext('2d');

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
        tooltips: {
            mode: "interpolate",
            intersect: true,
            callbacks: {
            title: function(a, d) {
                return a[0].xLabel;
            },
            label: function(i, d) {
                console.log(d.datasets[i.datasetIndex].label + ": " + i.yLabel)
                return (
                    d.datasets[i.datasetIndex].label + ": " + i.yLabel
                );
            }
            }
        },
        responsiveAnimationDuration: 0,
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
                        color: "#f4f4f4"
                },
                ticks: {
                    beginAtZero: true
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
