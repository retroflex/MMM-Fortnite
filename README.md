# MMM-Fortnite
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows Fortnite players' stats (score, matches played and kills). The stats shown are from all seasons and platforms.

The stats are fetched from [this API](https://fortniteapi.com) (which seem to bit unstable at times).

![screenshot](https://user-images.githubusercontent.com/25268023/57136270-91d57a00-6dac-11e9-8364-f3d2224688c8.png)

# Installation
1. Clone repo:
```
	cd MagicMirror/modules/
	git clone https://github.com/retroflex/MMM-Fortnite
```
2. Install dependencies:
```
	cd MMM-Fortnite/
	npm install
```
3. Add the module to the ../MagicMirror/config/config.js, example:
```
		{
			module: 'MMM-Fortnite',
			header: 'Fortnite',
			position: 'top_center',
			config: {
				showScore: false,
				userIDs: [ '4735ce9132924caf8a5b17789b40f79c', '3900c5958e4b4553907b2b32e86e03f8' ]
			}
		},
```
# Configuration
| Option                        | Description
| ------------------------------| -----------
| `showScore`                   | Whether to show column with the user's total score.<br />**Default value:** true
| `showMatchesPlayed`           | Whether to show column with the user's total number of matches played.<br />**Default value:** true
| `showKills`                   | Whether to show column with the user's total number of kills.<br />**Default value:** true
| `includeDefaultGameModes`     | Whether to include default game modes (solo, duo, squad) in count.<br />**Default value:** true
| `includeLimitedTimeGameModes` | Whether to include limited time game modes (e.g. blitz, snipers etc.) in count.<br />**Default value:** true
| `includeLargeTeamGameModes`   | Whether to include large team game modes (e.g. 50 vs 50) in count.<br />**Default value:** false
| `fetchInterval`               | How often to fetch stats (milliseconds).<br />**Default value:** 60 * 1000 (each minute)
| `userIDs`                     | Array of user ID's.<br />Use this URL to get the user ID from user name:<br />https://fortnite-public-api.theapinetwork.com/prod09/users/id?username=YOURUSERNAME<br />**Default value:** 4735ce9132924caf8a5b17789b40f79c (Ninja)

# Customize Looks
These items have own class names and can be customized via CSS (see [Fortnite.css](https://github.com/retroflex/MMM-Fortnite/blob/master/MMM-Fortnite.css) for example).
* Header table row
* Stats table rows
