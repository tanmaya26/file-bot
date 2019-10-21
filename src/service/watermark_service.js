var watermark_dbservice = require('../dbservice/watermark_dbservice');
var utils_service = require('./utils_service');
var slack_bot_service = require('./slack_bot_service');

var bot = slack_bot_service.bot

async function register_watermark(name, url, channel) {
	obj = {
		name: name,
		channel: channel,
		url: url
	}
	var result = await watermark_dbservice.create(obj).then((res) => res)
	return result
}

async function get_watermark(watermark_name, channel_name) {
	var watermark_image_url = await watermark_dbservice.get(watermark_name, channel_name).
		then((res) => {
			if (typeof res.Item != 'undefined') {
				return Promise.resolve(res.Item.url);
			}
			else {
				bot.postMessage(channel_name, 'Could not find watermark with name ' + watermark_name + " and channel " + channel_name);
				return Promise.reject(new Error('Could not find the watermark'));
			}
		});
	return watermark_image_url
}

function check_if_all_pdf(data) {
	var result = true
	data.files.forEach(f => {
		if (utils_service.get_file_extension(f.name) != 'pdf') {
			bot.postMessage(data.channel, 'Wrong format. All files must be of PDF format');
			result = false
		}
	});
	return result
}

module.exports.get_watermark = get_watermark;
module.exports.register_watermark = register_watermark;
module.exports.check_if_all_pdf = check_if_all_pdf;