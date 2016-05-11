var cheerio = require("cheerio"),
  http = require("http"),
  PushBullet = require("pushbullet"),
  config = require("./config.json");

// pushbullet object
var pusher = new PushBullet(config[0].pushbulletApiKey);
// refresh interval
var intervals = {
  length: 0
};

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
function checkSchedule(c) {
  download(c.url, function (data) {
    if (data) {
      var $ = cheerio.load(data);
      var size = $("tr.even").length;
      if (size >= 1) {
        sendNotification(c);
        clearInterval(intervals[c.i]);
      }
    } else {
      pusher.note("", "Cinema loader - Error!", "something went wrong, please chech me out", function (error, response) {});
      console.log("Error occured");
    }
  });
  return;
}

/**
 * Pushes link with info, that new schedule is available.
 * @return null
 */
function sendNotification(c) {
  pusher.link("", c.text + " - New schedule!", c.cinemaLink, function (error, response) {
    clearInterval(intervals[c.i]);
    delete intervals[c.i];
    intervals.length--;
    console.log("New program. Push sent.");
    if (intervals.length <= 0) {
      process.exit(0);
    }
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
  config.map(function(c, i) {
    c.i = i;
    intervals[c.i] = setInterval(function () {
      checkSchedule(c);
    }, c.refreshInterval * 1000);
    intervals.length++;
    checkSchedule(c);
    if (c.pingInterval) {
      setInterval(sendPing, c.pingInterval * 1000);
    }
  })
  return;
}

// start script
run();
