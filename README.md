# Cinema loader

Thanks to this, I don't need to reload cinema schedule while waiting for
premiere. When new schedule emerges, sends PushBullet notification.

## Usage

Get the code.

```shell
git clone https://github.com/ra100/cinema-loader
cd cinemacity-loader
npm install
```

Copy app/default.config.json to app/config.json and modify to suite your needs.

```shell
cp app/default.config.json app/config.json
nano app/config.json
```

Config structure

```json
[
  {
    "url": "https://www.cinemacity.cz/cz/data-api-service/v1/quickbook/10101/film-events/in-cinema/1052/at-date/YYYY-MM-DD?attr=&lang=cs_CZ",
    "pushbulletApiKey": "NONE",
    "cinemaLink": "http://cinemacity.cz/",
    "refreshInterval": "60",
    "pingInterval": "3600",
    "type": "cinemaCity"
  },
  {
    "url": "http://cinestar.cz/cz/?option=com_csevents&view=eventsforday&date=YYYY-MM-DD&cinema=11&titleId=0&format=raw&tpl=program",
    "pushbulletApiKey": "NONE",
    "cinemaLink": "http://cinestar.cz/",
    "refreshInterval": "60",
    "pingInterval": "3600",
    "type": "cineStar"
  }
]
```

- `url` - url where is the schelude info. Set `LOCATION`
  (Prague IMAX id = 1010105), set `date` you want to check

- `pushbulletApiKey` is your Access Token from <https://www.pushbullet.com/#settings>

- `cinemaLink` will be send as url in pushbullet link

- `refreshInterval` (in seconds) indicates how often should
  script check for new schedule

- `pingInterval` (in seconds) indicates how often do you
  want to get pings that script still runs, if you don't want to
  receive pings, set to `0`

- `type` which detection type it should use

Start app.

```shell
npm run app
```
