var cheerio = require("cheerio"),
  http = require("http"),
  PushBullet = require("pushbullet"),
  config = require("./config.json");

// pushbullet object
var pusher = new PushBullet(config[0].pushbulletApiKey);
// refresh interval
var interval;

/**
 * Utility function that downloads a URL and invokes callback with the data.
 * @param  {string}   url      URL location
 * @param  {Function} callback executes after contents are loaded
 * @return {null}
 */
function download(url, callback) {
  http.get(url, function (res) {
    var data = "";
    res.on("data", function (chunk) {
      data += chunk;
    });
    res.on("end", function () {
      callback(data);
    });
  }).on("error", function () {
    callback(null);
  });
}

/**
 * Download url and check content.
 * @return null
 */
function checkSchedule() {
  for (var i = 0; i < config.length; i++) {
    download(config[i].url, function (data) {
      if (data) {
        var $ = cheerio.load(data);
        var size = $("tbody tr td").length;
        if (size > 1) {
          sendNotification(config[i]);
          clearInterval(interval);
        }
      } else {
        pusher.note("", "Cinema loader - Error!",
          "something went wrong, please chech me out",
          function (error, response) {});
          console.log("Error occured");
      }
    });
  }
  return;
}

/**
 * Pushes link with info, that new schedule is available.
 * @return null
 */
function sendNotification(config) {
  pusher.link("", "Cinema loader - New schedule!", config.cinemaLink, function (error, response) {
    console.log("New program. Push sent.");
    process.exit(0);
  });
  return;
}

/**
 * Push note message showing that script still runs.
 * @return null
 */
function sendPing() {
  pusher.note("", "Cinema loder", "Just sain' I'm still running.", function (error, response) {
    console.log("Still running.");
  });
  return;
}

/**
 * App init function.
 * @return null
 */
function run() {
  console.log("Checking started.");
  interval = setInterval(checkSchedule, 60 * 1000);
  if (config[0].pingInterval > 0) {
    var pingInterval = setInterval(sendPing, config[0].pingInterval * 1000);
  }
  checkSchedule();
  return;
}

// start script
run();
