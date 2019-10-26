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
var file_url = "https://slack.com/api/files.list";

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

async function get_file_from_slack(channel, file_name) {
	var url = new URL(file_url);
	params = { channel: channel };
	url.search = new URLSearchParams(params).toString();
	const resource = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		withCredentials: true,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + process.env.BEARER_TOKEN
		}
	}).then((res) => res.json())
	var files = resource.files.filter(function (item) {
		return item.name == file_name;
	})
		.map(function (item) {
			return item.id;
		});
	return files
}

module.exports.slack = slack;
module.exports.bot = bot;
module.exports.bot_id = bot_id;
module.exports.get_slack_resource_from_url = get_slack_resource_from_url;
module.exports.get_json_data_from_url = get_json_data_from_url;
module.exports.get_file_from_slack = get_file_from_slack;
