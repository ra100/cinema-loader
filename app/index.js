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

const hasContent = (config, data) => {
  switch (config.type) {
    case 'cinemaCity':
      return data?.body?.events?.length > 0
    case 'cineStar':
    default:
      const $ = cheerio.load(data)
      return (size = $('tr.even').length) > 0
  }
}

const createTimer = config =>
  setTimeout(checkSchedule(config), config.refreshInterval * 1000)

/**
 * Download url and check content.
 * @return null
 */
const checkSchedule = config => () => {
  download(config.url)
    .then(data => {
      if (hasContent(config, data)) {
        return sendNotification(config)
      }
      return createTimer(config)
    })
    .catch(error => {
      console.error('Error occured', error)
      setTimeout(checkSchedule(config), config.refreshInterval)
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
const sendNotification = config => {
  pusher.link(
    '',
    `${config.text} - New schedule!`,
    config.cinemaLink,
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
  config.map((config, index) => {
    running++
    createTimer(config)
    checkSchedule(config)()
    if (config.pingInterval) {
      setInterval(sendPing, config.pingInterval * 1000)
    }
  })
}

// start script
run()
