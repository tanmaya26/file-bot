var watermark_service = require('../service/watermark_service');
var file_upload_service = require('../service/file_upload_service');
var utils_service = require('../service/utils_service');
var slack_bot_service = require('../service/slack_bot_service');

const nock = require("nock");
var bot = slack_bot_service.bot

async function init(command, data) {
	var bot_response = ""
	if (command[1] == 'register') {
		if (data.files.length == 0) {
			bot_response = "No file associated with command. Upload a PNG file with command to create watermark."
		}
		else if (data.files.length > 1) {
			bot_response = "Only one file should be associated with the command. Upload only file to create watermark."
		}
		else if (utils_service.get_file_extension(data.files[0].name) == 'png') {
			if (command.length == 3) {
				var register_success = await watermark_service.register_watermark(command[2], data.files[0].url_private, data.channel)
				if (register_success) {
					bot_response = "Watermark created successfully."
				}
			}
			else {
				// Provide a name for this watermark
				bot_response = "Please Provide a name for this watermark"
			}
		}
		else {
			// Wrong format. Only accept .png
			bot_response = "Wrong format for file . Watermark only accepts .png files"
		}

	}
	else if (command[1] == 'list') {
		bot_response = await watermark_service.get_all_watermarks(data.channel)
	}
	else if (command.length == 2 && data.files) {
		watermark_files(data, command[1])
	}

	bot.postMessage(data.channel, bot_response);
	return bot_response
}

function watermark_files(data, watermark_name) {
	if (watermark_service.check_if_all_pdf(data)) {
		data.files.forEach(f => {
			image_watermark_PDF(f.url_private, watermark_name, data.channel).then((water_marked_file) => {
				file_upload_service.upload_file_via_bot(water_marked_file, "watermark_" + f.name, data.channel)
					.then((res) => {
						if (res) {
							bot.postMessage(data.channel, 'File watermarked successfully');
						}
					})
			});
		});
	}
}

async function image_watermark_PDF(pdf_url, watermark_name, channel_name) {
	nock(pdf_url)
		.persist()
		.log(console.log)
		.get('')
		.replyWithFile(200, './test_files/sample.pdf', {
			'Content-Type': 'application/json',
		})

	const pdf = await slack_bot_service.get_slack_resource_from_url(pdf_url)

	const watermark_url = await watermark_service.get_watermark(watermark_name, channel_name).then((res) => res)

	nock(watermark_url)
		.persist()
		.log(console.log)
		.get('')
		.replyWithFile(200, './test_files/mock.png', {
			'Content-Type': 'application/json',
		})

	const watermark_png = await slack_bot_service.get_slack_resource_from_url(watermark_url)

	// Process the pdf and watermark it. Return the result

	watermarked_result = './test_files/temp_sample.pdf'
	return watermarked_result;
}

module.exports.init = init;