var cheerio = require("cheerio"),
  http = require("http"),
  PushBullet = require('pushbullet'),
  config = require('./config.json'),
  pusher = new PushBullet(config.pushbulletApiKey);

var interval;

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  http.get(url, function (res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function () {
      callback(data);
    });
  }).on("error", function () {
    callback(null);
  });
}

function checkSchedule() {
  download(config.url, function (data) {
    if (data) {
      var $ = cheerio.load(data);
      var size = $('tbody tr td').length;
      if (size > 1) {
        sendNotification();
        clearInterval(interval);
      }
    }
  });
}

function sendNotification() {
  pusher.link('', "New schedule", config.cinemaLink, function (error, response) {
    console.log('New program. Push sent.');
    process.exit(0);
  });
}

function sendPing() {
  pusher.note('', "Cinema loder", "Just sain' I'm still running.", function (error, response) {
    console.log('Still running.');
  });
}

function run() {
  console.log('Checking started.');
  interval = setInterval(checkSchedule, 60 * 1000);
  if (config.pingInterval > 0) {
    var pingInterval = setInterval(sendPing, config.pingInterval * 1000);
  }
  checkSchedule();
}

run();
