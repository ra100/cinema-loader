# CinemaCity checker

Thanks to this, I don't need to reload cinema schedule while waiting for
premiere. When new schedule emerges, sends PushBullet notification.

## Usage

Get the code.

```shell
git clone https://github.com/ra100/cinemacity-loader
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
  "refreshInterval": "60"
}
```

Set ```LOCATION``` (Prague IMAX id = 1010105), set ```date``` you want to check.
Enter you ```pushbulletApiKey``` (Access Token from <https://www.pushbullet.com/#settings>).

Start app.

```shell
npm run app
```

