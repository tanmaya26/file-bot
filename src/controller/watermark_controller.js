var file_upload_service = require('../service/file_upload_service');
var watermark_dbservice = require('../dbservice/watermark_dbservice');
var utils_service = require('../service/utils_service');
var slack_bot_service = require('../service/slack_bot_service');

var fs = require('fs');
var PDFLib = require('pdf-lib');
var Jimp = require('jimp');
var PDFDocument = PDFLib.PDFDocument;
var rgb = PDFLib.rgb;
var degrees = PDFLib.degrees;
var StandardFonts = PDFLib.StandardFonts;
var bot = slack_bot_service.bot

function init(command, data) {
	if (command[1] == 'register' && data.files.length == 1) {
		if (utils_service.get_file_extension(data.files[0].name) == 'png') {
			if (command.length == 3) {
				register_watermark(command[2], data.files[0].url_private, data.channel)
				bot.postMessage(data.channel, 'Watermark created successfully');
			}
			else {
				// Provide a name for this watermark
				bot.postMessage(data.channel, 'Please Provide a name for this watermark');
			}
		}
		else {
			// Wrong format. Only accept .png
			bot.postMessage(data.channel, 'Wrong format for file . Watermark only accepts .png files');
		}

	}
	else if (command.length == 2 && data.files) {
		watermark_files(data, command[1])
	}
}

function watermark_files(data, watermark_name) {
	if (check_if_all_pdf(data)) {
		data.files.forEach(f => {
			image_watermark_PDF(f.url_private, watermark_name, data.channel).then((water_marked_file) => {
				fs.writeFile("temp_" + f.name, water_marked_file, function (err, result) {
					file_upload_service.upload_file_via_bot("temp_" + f.name, "watermark_" + f.name, data.channel)
						.then((res) => {
							if (res.ok) {
								bot.postMessage(data.channel, 'File watermarked successfully');
							}
						})
				});
			});
		});
	}
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

async function text_watermark_Pdf(pdf_url, watermark_text) {
	const url = pdf_url
	const existingPdfBytes = await slack_bot_service.get_slack_resource_from_url(url)

	const pdfDoc = await PDFDocument.load(existingPdfBytes).catch(function (error) {
		console.log(error);
	});
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
	const pages = pdfDoc.getPages()
	const firstPage = pages[0]
	const { width, height } = firstPage.getSize()

	firstPage.drawText(watermark_text, {
		x: width / 2,
		y: height / 2 + 300,
		size: 50,
		font: helveticaFont,
		color: rgb(0.95, 0.1, 0.1),
		rotate: degrees(-45),
	})

	const pdfBytes = await pdfDoc.save()
	return pdfBytes;
}

async function image_watermark_PDF(pdf_url, watermark_name, channel_name) {
	const url = pdf_url
	pdfBytes = {}
	const existingPdfBytes = await slack_bot_service.get_slack_resource_from_url(url)

	const pdfDoc = await PDFDocument.load(existingPdfBytes).catch(function (error) {
		console.log(error);
	});
	const pngUrl = await get_watermark(watermark_name, channel_name).then((res) => res)
	const pngImageBytes = await slack_bot_service.get_slack_resource_from_url(pngUrl)

	await Jimp.read(pngImageBytes)
		.then(async (image) => {
			await image.opacity(0.1).getBufferAsync(Jimp.MIME_PNG).then(async (im) => {
				const pngImage = await pdfDoc.embedPng(im)
				const pngDims = pngImage.scale(0.5)

				const pages = pdfDoc.getPages()
				const firstPage = pages[0]

				firstPage.drawImage(pngImage, {
					x: firstPage.getWidth() / 2 - pngDims.width / 2,
					y: firstPage.getHeight() / 2 - pngDims.height / 2 + 250,
					width: pngDims.width,
					height: pngDims.height
				})
				pdfBytes = await pdfDoc.save()
			});
		})
	return pdfBytes;
}

function register_watermark(name, url, channel) {
	obj = {
		name: name,
		channel: channel,
		url: url
	}
	watermark_dbservice.create(obj)
}

async function get_watermark(watermark_name, channel_name){
	var watermark_image_url = await watermark_dbservice.get(watermark_name, channel_name).
	then((res) => {
		if (typeof res.Item != 'undefined') {
			return Promise.resolve(res.Item.url);
		}
		else{
			bot.postMessage(channel_name, 'Could not find watermark with name ' + watermark_name + " and channel " + channel_name);
			return Promise.reject(new Error('Could not find the watermark'));
		}
	});
	return watermark_image_url
}

module.exports.init = init;