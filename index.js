// Loading ENV vars
require('dotenv').config();

var watermark_controller = require('./controller/watermark_controller');
var slack_bot_service = require('./service/slack_bot_service');

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
var slack = slack_bot_service.slack

// creating a bot, for more options check: https://github.com/mishk0/slack-bot-api
var bot = slack_bot_service.bot

bot.on('start', function () {
	//Do something when the BOT starts 
	console.log('BOT started listening...');
});

// Event to listen all slack messages, to see all possible events check: https://api.slack.com/events-api
bot.on('message', function (data) {

	//Extract base command here

	if (data.text == '--watermark') {
		watermark_controller.init(data)
	}

	//When someone types "uploadPicture" the bot will upload the file on the #general channel
	if (data.text == 'uploadFile') {


	}
});
