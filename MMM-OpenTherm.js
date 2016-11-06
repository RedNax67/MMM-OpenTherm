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

	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
			nl: "translations/nl.json",
			de: "translations/de.json",
			dl: "translations/de.json"			
		};
	},

	// Define required scripts.
	getScripts : function () {
		return ["moment.js"];
	},

	// Define required scripts.
	getStyles : function () {
		return ["weather-icons.css", "weather-icons-wind.css", "MMM-OpenTherm.css"];
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
		this.alert = null;
		this.chPressurColor = null;
		this.loaded = false;
		this.minPressure = null;
		this.fault = null;
		this.faultcode = null;
		this.faulttext = null;
		this.updateTimer = null;
        
    this.getOpentherm();

	},
    
  	getOpentherm: function() {
		Log.info("Opentherm: Getting data.");
		
		this.sendSocketNotification("GET_OPENTHERM",this.config);

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

		var tabledata = document.createElement("td");
		var chPressureIconCell = document.createElement("i");
		chPressureIconCell.className = "small center wi wi-barometer " + this.chPressurColor;
		tabledata.appendChild(chPressureIconCell);
		row.appendChild(tabledata);
		

		var tabledata = document.createElement("td");
		var chPressureCell = document.createElement("td");
		chPressureCell.className = "small center " + this.chPressurColor;
		chPressureCell.innerHTML = this.chPressure;
		tabledata.appendChild(chPressureCell);
		row.appendChild(tabledata);

		//      ROW

		var row = document.createElement("tr");
		table.appendChild(row);

		var tabledata = document.createElement("td");

		var flameIconCell = document.createElement("i");
		flameIconCell.className = "small center bright wi " + this.flame;
		tabledata.appendChild(flameIconCell);

		row.appendChild(tabledata);

		var OutsideIconCell = document.createElement("td");
		OutsideIconCell.className = "small center fa fa-tree";
		row.appendChild(OutsideIconCell);

		var outsideTempCell = document.createElement("td");
		outsideTempCell.className = "small center";
		outsideTempCell.innerHTML = this.outsideTemperature;
		row.appendChild(outsideTempCell);

		var tabledata = document.createElement("td");
		tabledata.setAttribute("colspan", "2");

		var alertIconCell = document.createElement("i");
		alertIconCell.className = "small center bright " + this.alert;
		tabledata.appendChild(alertIconCell);

		row.appendChild(tabledata);

		//      ROW

		var row = document.createElement("tr");
		table.appendChild(row);

		var tabledata = document.createElement("td");
		tabledata.setAttribute("colspan", "6");
		
		var alertTxtCell = document.createElement("i");
		alertTxtCell.className = "small center bright red";
		alertTxtCell.innerHTML = this.faulttext;
		tabledata.appendChild(alertTxtCell);

		row.appendChild(tabledata);
		
		wrapper.appendChild(table);

		return wrapper;

	},


	/* processWeather(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Weather information received form openweather.org.
	 */
	processWeather : function (data) {
		this.roomTemperature = this.roundValue(data.temperature.value);
		this.setPoint = data.setpoint.value;
		this.outsideTemperature = data.outside.value;
		this.flame = "";
		if (data.flame.value == 1) {
			this.flame = "wi-fire";
			if (data.dhwmode.value == 1) {
				this.flame = "wi-raindrop";
			}
		}

		this.chPressurColor = "";
		this.alert = "";
		this.chPressure = data.pressure.value;
		if ( this.chPressure < this.minPressure ) {
			this.alert = "yellow fa fa-warning";
			this.chPressurColor = "yellow";
		}

		this.fault = data.fault.value;
		if ( this.fault > 0 || data.faultcode.value != 255 ) {
			this.alert = "center red fa fa-warning";
		}
		
		this.faulttext = this.wordwrap(this.translate(data.faultcode.value),35,'<BR>');
		
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},
    
  	socketNotificationReceived: function(notification, payload) {
		var self = this;

		//Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		
		if(notification === "OPENTHERM"){
				//Log.info('RECEIVED OPENTHERM MSG: '+ payload);
                self.processWeather(JSON.parse(payload));
		}
		
	},
    
  	wordwrap: function ( str, width, brk ) {
 
		brk = brk || 'n';
		width = width || 75;
 
		if (!str) { return str; }
 
		var re = new RegExp('.{1,'+ width +'}(\\s|$)|\\ S+?(\\s|$)','g'); 
	
		return str.match( RegExp(re) ).join( brk );
 
	},


    roundValue : function (temperature) {
		return parseFloat(temperature).toFixed(1);
	}


});
