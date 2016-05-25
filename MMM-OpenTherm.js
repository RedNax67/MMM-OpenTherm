/* global Module */

/* Magic Mirror
 * Module: MMM-OpenTherm
 *
 * By RedNax
 * MIT Licensed.
 */

Module.register("MMM-OpenTherm", {

	// Default module config.
	defaults : {
		updateInterval : 5000, // every second
		animationSpeed : 1000,

		initialLoadDelay : 0, // 0 seconds delay
		retryDelay : 2500,

		apiBase : "http://192.168.1.168:8080/json"

	},

	// Define required scripts.
	getScripts : function () {
		return ["moment.js"];
	},

	// Define required scripts.
	getStyles : function () {
		return ["weather-icons.css", "weather-icons-wind.css", "MMM-OpenTherm.css"];
	},

	// Define required translations.
	getTranslations : function () {
		// The translations for the defaut modules are defined in the core translation files.
		// Therefor we can just return false. Otherwise we should have returned a dictionairy.
		// If you're trying to build yiur own module including translations, check out the documentation.
		return false;
	},

	// Define start sequence.
	start : function () {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.roomTemperature = null;
		this.setPoint = null;
		this.chPressure = null;
		this.outsideTemperature = null;
		this.flame = null;

		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);

		this.updateTimer = null;

	},

	// Override dom generator.
	getDom : function () {

		var wrapper = document.createElement("div");

		if (this.config.url === "") {
			wrapper.innerHTML = "Please set the correct openweather <i>appid</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className = "small";

		//      ROW

		var row = document.createElement("tr");
		table.appendChild(row);

		var homeIconCell = document.createElement("td");
		homeIconCell.className = "small center fa fa-home";
		row.appendChild(homeIconCell);

		var roomTemperatureCell = document.createElement("td");
		roomTemperatureCell.className = "center large light";
		roomTemperatureCell.setAttribute("rowspan", "2");
		roomTemperatureCell.innerHTML = this.roomTemperature;
		row.appendChild(roomTemperatureCell);

		var setpointIconCell = document.createElement("td");
		setpointIconCell.className = "small center fa fa-cog";
		row.appendChild(setpointIconCell);

		var setPointCell = document.createElement("td");
		setPointCell.className = "small center";
		setPointCell.innerHTML = this.setPoint;
		row.appendChild(setPointCell);

		var chPressureIconCell = document.createElement("td");
		chPressureIconCell.className = "small center wi wi-barometer";
		row.appendChild(chPressureIconCell);

		var chPressureCell = document.createElement("td");
		chPressureCell.innerHTML = this.chPressure;
		row.appendChild(chPressureCell);

		//      ROW

		var row = document.createElement("tr");
		table.appendChild(row);

		var tabledata = document.createElement("td");

		var flameIconCell = document.createElement("i");
		flameIconCell.className = "center bright wi " + this.flame;
		tabledata.appendChild(flameIconCell);

		row.appendChild(tabledata);

		var OutsideIconCell = document.createElement("td");
		OutsideIconCell.className = "small center fa fa-tree";
		row.appendChild(OutsideIconCell);

		var outsideTempCell = document.createElement("td");
		outsideTempCell.className = "small center";
		outsideTempCell.innerHTML = this.outsideTemperature;
		row.appendChild(outsideTempCell);

		wrapper.appendChild(table);
		return wrapper;

	},

	/* updateWeather(compliments)
	 * Requests new data from openweather.org.
	 * Calls processWeather on succesfull response.
	 */
	updateWeather : function () {
		var url = this.config.apiBase;
		var self = this;
		var retry = true;

		var weatherRequest = new XMLHttpRequest();
		weatherRequest.open("GET", url, false);

		weatherRequest.onreadystatechange = function () {

			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processWeather(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.config.appid = "";
					self.updateDom(self.config.animationSpeed);

					Log.error(self.name + ": Incorrect APPID.");
					retry = false;
				} else {
					Log.error(self.name + ": Could not load weather.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		weatherRequest.send();
	},

	/* processWeather(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Weather information received form openweather.org.
	 */
	processWeather : function (data) {
		this.roomTemperature = this.roundValue(data.temperature.value);
		this.chPressure = data.pressure.value;
		this.setPoint = data.setpoint.value;
		this.outsideTemperature = data.outside.value;
		this.flame = "";
		if (data.flame.value == 1) {
			this.flame = "wi-fire";
		}

		// this.flame = "wi-fire";

		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate : function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function () {
			self.updateWeather();
		}, nextLoad);
	},

	roundValue : function (temperature) {
		return parseFloat(temperature).toFixed(1);
	}
});
