var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting node helper: " + this.name);
        
        this.config = {};
        this.fetcherRunning = false;
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " received notification: " + notification + " Payload: " + payload);
		
		if(notification === "GET_OPENTHERM"){
            
            this.config = payload;
            
            if (!this.fetcherRunning) {
                this.fetchOpentherm();
            }
			
		}
		
	},
    
    fetchOpentherm: function() {

        var self = this;
        this.fetcherRunning = true;
        
		// console.log(this.name + " request: " + this.config.api_url);
        
        request({
            url: this.config.api_url,
            method: 'GET'
                }, function(error, response, body) {

                    if (!error && response.statusCode == 200) {

                            self.sendSocketNotification('OPENTHERM',body);
                        
                    }
                        
                    setTimeout(function() {
                        self.fetchOpentherm();
                    }, self.config.updateInterval);

                }
        );
    }


});
