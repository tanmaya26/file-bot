var slackBot = require('slackbots');
var Slack = require('nodejslack');
const fetch = require("node-fetch");

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
// uncomment to run mock test
var slack = new Slack(process.env.SLACK_TOKEN);

// creating a bot, for more options check: https://github.com/mishk0/slack-bot-api
var bot = new slackBot({
	token: process.env.SLACK_TOKEN
});

var bot_id = process.env.BOT_ID

async function get_slack_resource_from_url(url) {
	const resource = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		withCredentials: true,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + process.env.SLACK_TOKEN
		}
	}).then((res) => res.arrayBuffer())
	return resource
}

async function get_json_data_from_url(url) {
	const resource = await fetch(url, {
		method: 'GET'
	}).then(function (response) {
		return response.json();
	})
		.then(function (json) {
			return json
		});
	return resource
}

async function delete_file_from_slack(url, file_id) {
	const resource = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		withCredentials: true,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN
		}, 
		body: JSON.stringify({
			file: file_id
		})
	}).then((res) => res)
	return resource
}

module.exports.slack = slack;
module.exports.bot = bot;
module.exports.bot_id = bot_id;
module.exports.get_slack_resource_from_url = get_slack_resource_from_url;
module.exports.get_json_data_from_url = get_json_data_from_url;
module.exports.delete_file_from_slack = delete_file_from_slack;
