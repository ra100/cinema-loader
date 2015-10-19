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
{
  "url": "http://cinemacity.cz/scheduleInfo?locationId=LOCATION&date=DD/MM/YYYY&venueTypeId=2&hideSite=0&newwin=1",
  "pushbulletApiKey": "NONE",
  "cinemaLink": "http://cinemacity.cz/",
  "refreshInterval": "60",
  "pingInterval": "3600"
}
```

*   ```url``` - url where is the schelude info. Set ```LOCATION```
(Prague IMAX id = 1010105), set ```date``` you want to check

*   ```pushbulletApiKey``` is your Access Token from <https://www.pushbullet.com/#settings>

*   ```cinemaLink``` will be send as url in pushbullet link

*   ```refreshInterval``` (in seconds) indicates how often should
script check for new schedule

*   ```pingInterval``` (in seconds) indicates how often do you
want to get pings that script still runs, if you don't want to
receive pings, set to ```0```

Start app.

```shell
npm run app
```

