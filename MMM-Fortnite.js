/* Magic Mirror
 * Module: MMM-Fortnite
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

Module.register('MMM-Fortnite', {
	// Default configuration.
	defaults: {
		showScore: true,
		showMatchesPlayed: true,
		showKills: true,
		includeDefaultGameModes: true,
		includeLimitedTimeGameModes: true,
		includeLargeTeamGameModes: false,
		userIDs: [ '4735ce9132924caf8a5b17789b40f79c' ],  // Ninja.
		fetchInterval: 60 * 1000  // In millisecs. Default each minute.
	},

	getStyles: function() {
		return [ 'modules/MMM-Fortnite/MMM-Fortnite.css' ];
	},

	getTranslations: function () {
		return {
			en: "translations/en.json",
			sv: "translations/sv.json"
		}
	},

	// Notification from node_helper.js.
	// The stats is received here. Then module is redrawn.
	// @param notification - Notification type.
	// @param payload - Contains an array of user stats. Each item in the array contains userName / score / matchesPlayed / kills.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'STATS_RESULT') {
			if (null == payload)
				return;

			if (null == payload.identifier)
				return;

			if (payload.identifier !== this.identifier)  // To make sure the correct instance is updated, since they share node_helper.
				return;

			if (null == payload.stats)
				return;

			if (0 === payload.stats.length)
				return;

			this.stats = payload.stats;
			this.updateDom(0);
		}
	},

	// Override dom generator.
	getDom: function () {
		let wrapper = document.createElement('table');
		if (null == this.stats) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = 'dimmed xsmall';
			return wrapper;
		}
		
		wrapper.className = 'bright xsmall';

		let headerRow = document.createElement('tr');
		headerRow.className = 'normal headerrow';
		this.createTableCell(headerRow, this.translate('USER_NAME'), true, true);
		this.createTableCell(headerRow, this.translate('SCORE'), this.config.showScore);
		this.createTableCell(headerRow, this.translate('MATCHES_PLAYED'), this.config.showMatchesPlayed);
		this.createTableCell(headerRow, this.translate('KILLS'), this.config.showKills);
		wrapper.appendChild(headerRow);

		for (let i = 0; i < this.stats.length; ++i) {
			let row = document.createElement('tr');
			row.className = 'normal bright statsrow';

			const stat = this.stats[i];
			this.createTableCell(row, stat.userName, true, true);
			this.createTableCell(row, stat.score, this.config.showScore);
			this.createTableCell(row, stat.matchesPlayed, this.config.showMatchesPlayed);
			this.createTableCell(row, stat.kills, this.config.showKills);

			wrapper.appendChild(row);
		}

		return wrapper;
	},

	// Override start to init stuff.
	start: function() {
		this.stats = null;

		// Tell node_helper to load stats at startup.
		this.sendSocketNotification('GET_STATS', { identifier: this.identifier,
		                                           userIDs: this.config.userIDs,
		                                           includeDefaultGameModes: this.config.includeDefaultGameModes,
		                                           includeLimitedTimeGameModes: this.config.includeLimitedTimeGameModes,
		                                           includeLargeTeamGameModes: this.config.includeLargeTeamGameModes });

		// Make sure stats are reloaded at user specified interval.
		let interval = Math.max(this.config.fetchInterval, 1000);  // In millisecs. < 1 min not allowed.
		let self = this;
		setInterval(function() {
			self.sendSocketNotification('GET_STATS', { identifier: self.identifier,
			                                           userIDs: self.config.userIDs,
			                                           includeDefaultGameModes: self.config.includeDefaultGameModes,
			                                           includeLimitedTimeGameModes: self.config.includeLimitedTimeGameModes,
			                                           includeLargeTeamGameModes: self.config.includeLargeTeamGameModes });
		}, interval); // In millisecs.
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param string - The text to show.
	// @param show - Whether to actually show.
	// @param leftAlign - True to left align text. False to center align.
	createTableCell: function(row, string, show, leftAlign = false)
	{
		if (!show)
			return;
		
		let cell = document.createElement('td');
		cell.innerHTML = string;
		
		if (leftAlign)
			cell.style.cssText = 'text-align: left;';
		else
			cell.style.cssText = 'text-align: right;';

		row.appendChild(cell);
	}
});
