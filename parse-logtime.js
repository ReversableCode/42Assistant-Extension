var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

var getHTML = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'document';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

var user = "";
var week = 7;
var hour = 0;
var minute = 0;
var second = 0;

getHTML('https://profile.intra.42.fr/', function (err, data) {
    if (err !== null) {
        alert('Something went wrong: ' + err);
    } else {
        if (data.getElementsByTagName("title")[0].innerText == "Intra Signin  New") {
            document.getElementById("bg-frame").innerHTML = "<div class=\"user-data\"><div class=\"user-header-box location\"><div class=\"user-poste-infos\" style=\"text-align: center; vertical-align: middle; \">Please Login first to http://intra.42.fr</div></div></div>";
        }
        user = data.getElementsByClassName("login")[0].innerText;
        getJSON('https://profile.intra.42.fr/users/' + user + '/locations_stats', function (err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                for (var key in data) {
                    week -= 1;
                    if (week <= 0) continue;
                    var splitTime = data[key].split(':');
                    var h = 0;
                    var m = 0;
                    var s = 0;
                    h = parseInt(splitTime[0]);
                    m = parseInt(splitTime[1]);
                    s = parseInt(splitTime[2]);
                    h = h + m / 60;
                    m = m % 60;
                    m = m + s / 60;
                    s = s % 60;
                    hour += h;
                    minute += m;
                    second += s;
                }
                hour = hour + minute / 60;
                minute = minute % 60;
                minute = minute + second / 60;
                second = second % 60;
                console.log(Math.ceil(hour) + 'h' + Math.ceil(minute));
            }
        });
        document.getElementById("profile_img").style.backgroundImage = data.getElementsByClassName("user-profile-picture visible-sidebars")[0].style.backgroundImage;
        var udiv = data.getElementsByClassName("user-cursus")[0].innerHTML;
        document.getElementsByClassName("user-cursus-value")[0].innerHTML = udiv;
        udiv = data.getElementsByClassName("user-grade-value")[0].innerHTML;
        document.getElementsByClassName("user-grade-value")[0].innerHTML = udiv;
        udiv = data.getElementsByClassName("user-correction-point-value")[0].innerHTML;
        document.getElementsByClassName("user-correction-point-value")[0].innerHTML = udiv;
        udiv = data.getElementsByClassName("user-wallet-value")[0].innerHTML;
        document.getElementsByClassName("user-wallet-value")[0].innerHTML = udiv;

        udiv = data.getElementsByClassName("user-header-box location")[0].innerHTML;
        document.getElementsByClassName("user-header-box location")[0].innerHTML = udiv;

        udiv = data.getElementsByClassName("coalition-span")[0].innerHTML;
        document.getElementsByClassName("coalition-span1")[0].innerHTML = udiv;
        udiv = data.getElementsByClassName("name margin-top-15 margin-bottom-10")[0].innerHTML;
        document.getElementsByClassName("coalition-span1")[1].innerHTML = udiv;
        document.getElementsByClassName("coalition-span1")[2].innerHTML = user;

        document.getElementById("bg-frame").style.backgroundImage = data.getElementsByClassName("container-inner-item profile-item-top profile-banner home-banner flex flex-direction-row")[0].style.backgroundImage;
        var y = document.getElementsByClassName("coalition-span");
        var color = data.getElementsByClassName("coalition-span")[0].style.color;
        var i;
        for (i = 0; i < y.length; i++) {
            y[i].style.color = color;
        }
    }
});

$(document).ready(function () {
    var chart = {
        type: "solidgauge",
        backgroundColor: "none",
        width: 260,
        height: 140,
        alignTicks: false
    };
    var title = null;
    var pane = {
        center: ["50%", "85%"],
        size: "140%",
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: "transparent",
            borderWidth: 0,
            innerRadius: "90%",
            outerRadius: "92%",
            shape: "arc"
        }
    };
    var tooltip = {
        enabled: false
    };
    var yAxis = {
        min: 0,
        max: 90,
        gridLineColor: "transparent",
        lineColor: "transparent",
        color: "transparent",
        tickColor: "transparent",
        stops: [
            [.1, "#d8636f"],
            [.5, "#e6b291"],
            [1, '#55BF3B']
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 4,
        tickInterval: Math.floor(90 / 3)
    };
    var credits = {
        enabled: false
    };
    var series = [{
        name: "Speed",
        data: [{
            y: Math.ceil(hour),
            radius: "105%",
            innerRadius: "90%"
        }],
        tooltip: {
            valueSuffix: "hours"
        },
        stickyTracking: true,
        dataLabels: {
            borderColor: "transparent",
            enabled: true,
            format: '<div style="text-align:center; position: relative; top: 4px"><span style="font-size:20px;color:white">{y}</span><br/><span style="font-size:12px;color:silver">hours</span><br/><span style="position: relative; top: 10px; font-family: \'futuraBold\'; color: #eee"></span></div>',
            color: "#fff",
            shadow: false,
            style: "font-size: 2em; color: #fff",
            useHTML: true
        }
    }];

    var json = {};
    json.chart = chart;
    json.title = title;
    json.pane = pane;
    json.tooltip = tooltip;
    json.yAxis = yAxis;
    json.credits = credits;
    json.series = series;
    $('#container-speed').highcharts(json);

    var chartFunction = function () {
        var chart = $('#container-speed').highcharts();
        var point;
        var newVal;

        if (chart) {
            point = chart.series[0].points[0];
            newVal = Math.ceil(hour);
            if (newVal > 90) {
                newVal = 90;
            }
            point.update(newVal);
        }
    };
    setInterval(chartFunction, 2000);
});
