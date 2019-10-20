var slackBot = require('slackbots');
var Slack = require('nodejslack');

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
var slack = new Slack(process.env.SLACK_TOKEN);

// creating a bot, for more options check: https://github.com/mishk0/slack-bot-api
var bot = new slackBot({
	token: process.env.SLACK_TOKEN
});


module.exports.slack = slack;
module.exports.bot = bot;