var slack_bot_service = require('./slack_bot_service');
var got_service = require('./got_service');
const nock = require("nock");
var slack = slack_bot_service.slack
const mock_data = require("../../mock.json")
const got  = require('got');

async function update_alert_size_for_workspace(size, data) {
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
				reply = mock_data.dynamoDB.storage[0].size;

				var res = nock("http://dynamodb.us-east-1.amazonaws.com")
					.post("/storage")
			      	.reply(200, JSON.stringify(reply));

				let response = await got_service.post_request("http://dynamodb.us-east-1.amazonaws.com/storage", "");
			  	return "New Size Limit has been set to " + JSON.stringify(response);
			}
		}
	}
	catch(err) {
		console.log("Error Occurred: ", err);
    	return err;
  	}
}

async function get_alert_size_for_workspace() {
	// get the size from DynamoDB
	reply = mock_data.workspace_size
	var res = nock("http://dynamodb.us-east-1.amazonaws.com")
				      .get("/storage")
				      .reply(200, JSON.stringify(reply));

	let response = await got_service.get_request("http://dynamodb.us-east-1.amazonaws.com/storage");
  	return "Current size limit is " + JSON.stringify(response);
}

module.exports.update_alert_size_for_workspace = update_alert_size_for_workspace;
module.exports.get_alert_size_for_workspace = get_alert_size_for_workspace;
