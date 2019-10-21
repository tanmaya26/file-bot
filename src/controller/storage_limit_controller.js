var storage_limit_service = require('../service/storage_limit_service');
var slack_bot_service = require('../service/slack_bot_service');
var bot = slack_bot_service.bot;

function setSize(size, data) {
	var response = storage_limit_service.update_alert_size_for_workspace(size, data);
	bot.postMessage(data.channel, response);
}

function getSize(data) {
	var response = storage_limit_service.get_alert_size_for_workspace();
	bot.postMessage(data.channel, response);
}


module.exports.setSize = setSize;
module.exports.getSize = getSize;