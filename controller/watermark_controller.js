var file_upload_service = require('../service/file_upload_service');
var fs = require('fs');
var PDFLib = require('pdf-lib');
const fetch = require("node-fetch");
var Jimp = require('jimp');
var PDFDocument = PDFLib.PDFDocument;
var rgb = PDFLib.rgb;
var degrees = PDFLib.degrees;
var StandardFonts = PDFLib.StandardFonts;

function init(data) {
	if (data.files) {
		watermark_files(data)
	}
}

function watermark_files(data) {
	data.files.forEach(f => {
		image_watermark_PDF(f.url_private).then((water_marked_file) => {
			fs.writeFile("temp_" + f.name, water_marked_file, function (err, result) {
				file_upload_service.upload_file_via_bot("temp_" + f.name, "watermark_" + f.name, data.channel);
			});
		});
	});
}

async function text_watermark_Pdf(pdf_url, watermark_text) {
	const url = pdf_url
	const existingPdfBytes = await get_slack_resource_from_url(url)

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

async function image_watermark_PDF(pdf_url) {
	const url = pdf_url
	pdfBytes = {}
	const existingPdfBytes = await get_slack_resource_from_url(url)

	const pdfDoc = await PDFDocument.load(existingPdfBytes).catch(function (error) {
		console.log(error);
	});
	const pngUrl = 'https://files.slack.com/files-pri/TNTGTLN5U-FPCT4L5G9/383groudon.png'
	const pngImageBytes = await get_slack_resource_from_url(pngUrl)

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

module.exports.init = init;