const https = require('https')
const cheerio = require('cheerio')
const PushBullet = require('pushbullet')

const config = require('./config.json')

// pushbullet object
const pusher = new PushBullet(config[0].pushbulletApiKey)
let running = 0

/**
 * Utility function that downloads a URL and invokes callback with the data.
 * @param  {string}   url      URL location
 * @param  {Function} callback executes after contents are loaded
 * @return {null}
 */
const download = url =>
  new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = ''
        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', () => {
          resolve(data)
        })
      })
      .on('error', () => {
        reject('Download error')
      })
  })

/**
 * Download url and check content.
 * @return null
 */
const checkSchedule = c => () => {
  download(c.url)
    .then(data => {
      var $ = cheerio.load(data)
      var size = $('tr.even').length
      if (size >= 1) {
        return sendNotification(c)
      }
      return setTimeout(checkSchedule(c), c.refreshInterval)
    })
    .catch(error => {
      console.error('Error occured', error)
      setTimeout(checkSchedule(c), c.refreshInterval)
      pusher.note(
        '',
        'Cinema loader - Error!',
        'something went wrong, please chech me out',
        (error, response) => {}
      )
    })
}

/**
 * Pushes link with info, that new schedule is available.
 * @return null
 */
const sendNotification = c => {
  pusher.link(
    '',
    `${c.text} - New schedule!`,
    c.cinemaLink,
    (error, response) => {
      console.log('New program. Push sent.')
      running--
      if (running <= 0) {
        process.exit(0)
      }
    }
  )
}

/**
 * Push note message showing that script still runs.
 * @return null
 */
const sendPing = () => {
  pusher.note(
    '',
    'Cinema loder',
    "Just sain' I'm still running.",
    (error, response) => {
      console.log('Still running.')
    }
  )
}

/**
 * App init function.
 * @return null
 */
const run = () => {
  console.log('Checking started.')
  config.map((c, i) => {
    running++
    setTimeout(checkSchedule(c), c.refreshInterval * 1000)
    checkSchedule(c)()
    if (c.pingInterval) {
      setInterval(sendPing, c.pingInterval * 1000)
    }
  })
}

// start script
run()
