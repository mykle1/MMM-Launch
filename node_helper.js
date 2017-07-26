/* Magic Mirror
 * Module: MMM-Launch
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getLaunch: function(url) {
        request({
            url: url,
            method: 'GET',
			headers: {
             'User-Agent': 'request'
              }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).launches; // Parsing an array
		//		console.log(response.statusCode + result); // checking data
                    this.sendSocketNotification('LAUNCH_RESULT', result);
		
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_LAUNCH') {
            this.getLaunch(payload);
        }
    }
});
