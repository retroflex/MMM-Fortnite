/* Magic Mirror
 * Module: MMM-Fortnite
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const rp = require('request-promise');
const baseURL = 'https://fortnite-public-api.theapinetwork.com/prod09/users/public/br_stats_v2?user_id=';

module.exports = NodeHelper.create({
	start: function() {
		//console.log('Starting node_helper for: ' + this.name);
	},

	// Extracts JSON into the relevant stats.
	// JSON can contain these (but not all are necessarily present):
	//   json.overallData.defaultModes.score / .matchesPlayed / .kills
	//   json.overallData.ltmModes.score / .matchesPlayed / .kills
	//   json.overallData.largeTeamModes.score / .matchesPlayed / .kills
	// @param json - The full JSON for the user.
	// @return Object with stats we want to show.
	extractStats: function(json, includeDefaultGameModes, includeLimitedTimeGameModes, includeLargeTeamGameModes) {
		let totalScore = 0;
		let totalMatchesPlayed = 0;
		let totalKills = 0;

		if (includeDefaultGameModes) {
			const defaultModes = json.overallData.defaultModes;
			if (defaultModes != null) {
				if (defaultModes.score         != null)  totalScore         += defaultModes.score;
				if (defaultModes.matchesplayed != null)  totalMatchesPlayed += defaultModes.matchesplayed;
				if (defaultModes.kills         != null)  totalKills         += defaultModes.kills;
			}
		}

		if (includeLimitedTimeGameModes) {
			const limitedTimeModes = json.overallData.ltmModes;
			if (limitedTimeModes != null) {
				if (limitedTimeModes.score         != null)  totalScore         += limitedTimeModes.score;
				if (limitedTimeModes.matchesplayed != null)  totalMatchesPlayed += limitedTimeModes.matchesplayed;
				if (limitedTimeModes.kills         != null)  totalKills         += limitedTimeModes.kills;
			}
		}

		if (includeLargeTeamGameModes) {
			const largeTeamModes = json.overallData.largeTeamModes;
			if (largeTeamModes != null) {
				if (largeTeamModes.score         != null)  totalScore         += largeTeamModes.score;
				if (largeTeamModes.matchesplayed != null)  totalMatchesPlayed += largeTeamModes.matchesplayed;
				if (largeTeamModes.kills         != null)  totalKills         += largeTeamModes.kills;
			}
		}

		const stats = { userName: json.epicName,
		                score: totalScore,
		                matchesPlayed: totalMatchesPlayed,
		                kills: totalKills };
		return stats;
	},

	// Gets Fortnite user stats from API and adds them to an array.
	// Each item in the array contains userName / score / matchesPlayed / kills.
	// The stats are the total for all seasons and all game modes.
	// The array is then sent to the client (to MMM-Fortnite.js).
	// @param userIDs - String array of user ID's.
	getStats: function(payload) {
		let userIDs = payload.userIDs;

		let promises = [];
		for (let i = 0; i < userIDs.length; ++i) {
			const userURL = baseURL + userIDs[i];
			const options = {uri: userURL};
			promises.push(rp(options));
		}

		Promise.all(promises).then((contents) => {
			let stats = [];

			for (let i = 0; i < contents.length; ++i) {
				const content = contents[i];
				const json = JSON.parse(content);
				
				const stat = this.extractStats(json, payload.includeDefaultGameModes, payload.includeLimitedTimeGameModes, payload.includeLargeTeamGameModes);
				stats.push(stat);
			}

			stats.sort((a, b) => Number(b.score) - Number(a.score));  // Sort users by score.

			this.sendSocketNotification('STATS_RESULT', stats);
		}).catch(err => {
			console.log(this.name + ' error when fetching data: ' + err);
		});
	},

	// Listens to notifications from client (from MMM-Fortnite.js).
	// Client sends a notification when it wants download new stats.
	// @param payload - String array of user ID's.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'GET_STATS') {
			this.getStats(payload);
		}
	}

});
