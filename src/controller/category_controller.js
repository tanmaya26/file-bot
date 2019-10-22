var category_service = require('../service/category_service');
var slack_bot_service = require('../service/slack_bot_service');
var bot = slack_bot_service.bot;
const nock = require("nock");

async function setCategory(category_name, data) {
	var response = await category_service.setCategory(category_name, data).then((res) =>res);
	bot.postMessage(data.channel, response);
}

async function getCategories(data) {
	var response = await category_service.getCategories().then((res) =>res);
	bot.postMessage(data.channel, response);
}

async function addFileToCategory(category_name, file_name, data) {
	var response = await category_service.addFileToCategory(category_name, file_name, data).then((res) =>res);
	bot.postMessage(data.channel, response);
}

async function showFilesOfACategory(category_name, data) {
	var response = await category_service.showFilesOfACategory(category_name, data).then((res) =>res);
	bot.postMessage(data.channel, response);
}

async function exportDeleteFile(file_name, storage_name, data, is_export) {
	var response = await category_service.exportDeleteFile(file_name, storage_name, data, is_export).then((res) =>res);
	bot.postMessage(data.channel, response);
}

async function exportDeleteCategory(category_name, storage_name, data, is_export) {
	var response = await category_service.exportDeleteCategory(category_name, storage_name, data, is_export).then((res) =>res);
	bot.postMessage(data.channel, response);
}

module.exports.setCategory = setCategory;
module.exports.getCategories = getCategories;
module.exports.addFileToCategory = addFileToCategory;
module.exports.showFilesOfACategory = showFilesOfACategory;
module.exports.exportDeleteFile = exportDeleteFile;
module.exports.exportDeleteCategory = exportDeleteCategory;
