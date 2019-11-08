var export_service = require('../service/export_service');
var slack_bot_service = require('../service/slack_bot_service');
var bot = slack_bot_service.bot;

async function deleteCategoryFiles(category_name, data) {
	var response = await export_service.deleteCategoryFiles(category_name, data).then((res) => res);
	bot.postMessage(data.channel, response);
}

async function exportCategory(category_name, storage_name, data) {
	if(storage_name !== 'googleDrive') {
		bot.postMessage(data.channel, "Wrong storage name. Only googleDrive is accepted.");
	} else {
		var response = await export_service.exportCategory(category_name, data).then((res) => res);
		bot.postMessage(data.channel, response);
	}
}


module.exports.deleteCategoryFiles = deleteCategoryFiles;
module.exports.exportCategory = exportCategory;
