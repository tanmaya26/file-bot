// Loading ENV vars
require('dotenv').config();

var watermark_controller = require('./controller/watermark_controller');
var slack_bot_service = require('./service/slack_bot_service');
var utils_service = require('./service/utils_service');
var storage_limit_controller = require('./controller/storage_limit_controller');
var category_controller = require('./controller/category_controller');

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
var slack = slack_bot_service.slack

// creating a bot, for more options check: https://github.com/mishk0/slack-bot-api
var bot = slack_bot_service.bot

// Load bot id
var bot_id = slack_bot_service.bot_id

bot.on('start', function () {
	//Do something when the BOT starts 

	console.log('BOT started listening...');
});


// Event to listen all slack messages, to see all possible events check: https://api.slack.com/events-api
bot.on('message', function (data) {
	//Extract base command here
	if (typeof data.text != 'undefined') {
		cmd = utils_service.split_command(data.text)
		if (cmd[0] == bot_id) {
			cmd.shift()
			if (cmd[0] == '--watermark') {
				watermark_controller.init(cmd, data)
			} else if (cmd[0] == '--setStorageSize') {
				storage_limit_controller.setSize(cmd[1], data);
			} else if (cmd[0] == '--getStorageSize') {
				storage_limit_controller.getSize(data);
			} else if (cmd[0] == '--registerCategory') {
				category_controller.setCategory(cmd[1], data);
			} else if (cmd[0] == '--getCategories') {
				category_controller.getCategories(data);
			} else if (cmd[0] == '--addCategory') {
				category_controller.addFileToCategory(cmd[1], cmd[2], data);
			} else if (cmd[0] == '--showFiles') {
				category_controller.showFilesOfACategory(cmd[1], data);
			} else if (cmd[0] == '--exportCategory' || cmd[0] == '--deleteCategory') {
				if (cmd[0] == '--exportCategory') {
					category_controller.exportDeleteCategory(cmd[1], cmd[2], data, true);
				} else {
					category_controller.exportDeleteCategory(cmd[1], "", data, false);
				}
			}
		}
	}
});
