var category_service = require('../service/category_service');
var slack_bot_service = require('../service/slack_bot_service');
var bot = slack_bot_service.bot;

function setCategory(category_name, data) {
	var response = category_service.setCategory(category_name, data);
	bot.postMessage(data.channel, response);
}

function getCategories(data) {
	var response = category_service.getCategories();
	bot.postMessage(data.channel, response);
}

function addFileToCategory(category_name, file_name, data) {
	var response = category_service.addFileToCategory(category_name, file_name, data);
	bot.postMessage(data.channel, response);
}

function showFilesOfACategory(category_name, data) {
	var response = category_service.showFilesOfACategory(category_name, data);
	bot.postMessage(data.channel, response);
}

module.exports.setCategory = setCategory;
module.exports.getCategories = getCategories;
module.exports.addFileToCategory = addFileToCategory;
module.exports.showFilesOfACategory = showFilesOfACategory;
