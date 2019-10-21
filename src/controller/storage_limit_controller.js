var storage_limit_service = require('../service/storage_limit_service');
var slack_bot_service = require('../service/slack_bot_service');
var bot = slack_bot_service.bot;

async function setSize(size, data) {
	var response = await storage_limit_service.update_alert_size_for_workspace(size, data).then((res) =>res);
	bot.postMessage(data.channel, response);
}

async function getSize(data) {
	var response = await storage_limit_service.get_alert_size_for_workspace().then((res) =>res);
	bot.postMessage(data.channel, response);
}


module.exports.setSize = setSize;
module.exports.getSize = getSize;