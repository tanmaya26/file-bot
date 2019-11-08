var Slack = require('nodejslack');
const USER_SLACK_TOKEN = process.env.USER_SLACK_TOKEN
var slackapi = new Slack(USER_SLACK_TOKEN);
var storage_limit_dbservice = require("../dbservice/storage_limit_dbservice.js")

async function updateAlertSizeForChannel(size, data) {
	
	try {
		if (isNaN(size)) {
			throw "Please enter a number for storage size(in GB)."
		} else {
			temp_size = parseFloat(size);
			if (temp_size > 5.0) {
				throw "Error. Size limit cannot be more than 5.0"
			} else {
                
                let response = await storage_limit_dbservice.setAlertSize(data.channel, size).then((res) => {return res;});
                if (response) {
                    return "New Alert Limit has been set to " + parseFloat(size) + " GB";
                } else {
                    return "Failed updating alert limit size";
                }
				
			}
		}
	}
	catch (err) {
		console.log("Error Occurred: ", err);
		return err;
	}
}

async function getAlertSizeforChannel(channel) {
	
    var current_alert_size = await storage_limit_dbservice.getAlertSize(channel).then((res) => {return res;});

    if (current_alert_size == -1) {
        return "Unable to get the alert limit."
    }
    
    return "Current size limit is " + parseFloat(current_alert_size) + " GB";
}


async function totalFileSizeByChannel(channel) {
    var files = await slackapi.getFilesList({ "channel": channel})
                    .then(function(answer){
                        return Promise.resolve(answer.files);
                    })
                    .catch(function(err){
                        console.log('DID NOT GET FILES LIST:',err);
                        return -1;
                    });

    if (files == -1) {
        return -1;
    }

    var totalSize = 0;
    for( var file in files) {
        totalSize +=  parseInt(files[file].size);
    }

    totalSize /= 1000000000;

    return totalSize

    
}

async function deleteActivity(channel) {
    var underLimit = true;
    var newCurrentSize = await totalFileSizeByChannel(channel).then((res) => {return res;});
    if (newCurrentSize == -1) {
        return [false,underLimit];
    }
    var currentAlertSize = await storage_limit_dbservice.getAlertSize(channel).then((res) => {return res;});
    if (parseFloat(newCurrentSize) > parseFloat(currentAlertSize)) {
        underLimit = false
    }
    
    var updateDB = await storage_limit_dbservice.setCurrentSize(channel, newCurrentSize).then((res) => {return res;});

    if (!updateDB) {
        return [false, underLimit];
    }
    return [true, underLimit, newCurrentSize, currentAlertSize];
}

async function uploadActivity(channel) {
    var underLimit = true;
    var newCurrentSize = await totalFileSizeByChannel(channel).then((res) => {return res;});
    if (newCurrentSize == -1) {
        return [false,underLimit];
    }
    var currentAlertSize = await storage_limit_dbservice.getAlertSize(channel).then((res) => {return res;});
    if ( parseFloat(newCurrentSize) > parseFloat(currentAlertSize)) {
        underLimit = false
    }
    
    var updateDB = await storage_limit_dbservice.setCurrentSize(channel, newCurrentSize).then((res) => {return res;});

    if (!updateDB) {
        return [false, underLimit];
    }
    return [true, underLimit, newCurrentSize, currentAlertSize];
}


module.exports.updateAlertSizeForChannel = updateAlertSizeForChannel;
module.exports.getAlertSizeforChannel = getAlertSizeforChannel;
module.exports.deleteActivity = deleteActivity;
module.exports.uploadActivity = uploadActivity;