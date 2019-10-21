var slackBot = require('slackbots');
var Slack = require('nodejslack');
const fetch = require("node-fetch");

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
// uncomment to run mock test
process.env.SLACK_TOKEN = "xoxb-775571702198-775695559382-MSox8rQEc2qhmuGa9wz3JiNJ"  
var slack = new Slack(process.env.SLACK_TOKEN);

// creating a bot, for more options check: https://github.com/mishk0/slack-bot-api
var bot = new slackBot({
	token: process.env.SLACK_TOKEN
});

async function get_slack_resource_from_url(url) {
	const resource = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		withCredentials: true,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer xoxb-775571702198-775695559382-MSox8rQEc2qhmuGa9wz3JiNJ'
		}
	}).then((res) => res.arrayBuffer())
	return resource
}


module.exports.slack = slack;
module.exports.bot = bot;
module.exports.get_slack_resource_from_url = get_slack_resource_from_url;