var slack_bot_service = require('./slack_bot_service');
var slack = slack_bot_service.slack
var MAX_SIZE_FOR_ALERT = 3.0;

function update_alert_size_for_workspace(size, data) {
	// set the global MAX_SIZE_FOR_ALERT to DynamoDB
	try {
		if(isNaN(size)) {
			throw "Not a number"
		} else {
			temp_size = parseFloat(size);
			if(temp_size > 5.0) {
				throw "Error. Size limit cannot be more than 5.0"
			} else {
				// set this in DynamoDB
				MAX_SIZE_FOR_ALERT = temp_size;
				return "Size Limit has been set to " + size.toString();
			}
		}
		
	}
	catch(err) {
		console.log("Error Occurred: ", err);
    	return err;
  	}
}

function get_alert_size_for_workspace() {
	// get the size from DynamoDB
	return "Current size limit is " + MAX_SIZE_FOR_ALERT.toString();
}

module.exports.update_alert_size_for_workspace = update_alert_size_for_workspace;
module.exports.get_alert_size_for_workspace = get_alert_size_for_workspace;