var slack_bot_service = require('./slack_bot_service');
var slack = slack_bot_service.slack
var got_service = require('./got_service');
const nock = require("nock");
const mock_data = require("../mock.json")
const got = require('got');

async function setCategory(category_name, data) {
	// set the global to DynamoDB
	try {
		reply = mock_data.dynamoDB.catalog
		var res = nock("http://dynamodb.us-east-1.amazonaws.com/catalog")
			.get("")
			.reply(200, reply);

		let temp = await slack_bot_service.get_json_data_from_url("http://dynamodb.us-east-1.amazonaws.com/catalog");

		categories = {};
		for (const x of temp) {
			categories[x.pname] = { "pid": x.pid, "cid": x.cid };
		}

		if (category_name in categories) {
			throw "Error. Category name already exists."
		} else {
			reply = mock_data.result_catalog.catalog[0].pname
			var res = nock("http://dynamodb.us-east-1.amazonaws.com")
				.post("/catalog")
				.reply(200, JSON.stringify(reply));

			let response = await got_service.post_request("http://dynamodb.us-east-1.amazonaws.com/catalog", "");
			return "Category has been added with name: " + response;
		}
	}
	catch (err) {
		console.log("Error Occurred: ", err);
		return err;
	}
}

async function getCategories() {
	// get the categories from DynamoDB
	reply = mock_data.dynamoDB.catalog
	var res = nock("http://dynamodb.us-east-1.amazonaws.com/catalog")
		.get("")
		.reply(200, reply);

	let temp = await slack_bot_service.get_json_data_from_url("http://dynamodb.us-east-1.amazonaws.com/catalog");

	categories = {};
	var ans = "";
	for (const x of temp) {
		categories[x.pname] = { "pid": x.pid, "cid": x.cid };
		ans = ans + " " + x.pname + ",";
	}
	return "Categories are: " + ans;
}

async function addFileToCategory(category_name, file_name, data) {
	try {
		reply = mock_data.dynamoDB.catalog
		var res = nock("http://dynamodb.us-east-1.amazonaws.com/catalog")
			.get("")
			.reply(200, reply);

		let temp = await slack_bot_service.get_json_data_from_url("http://dynamodb.us-east-1.amazonaws.com/catalog");

		categories = {};
		for (const x of temp) {
			categories[x.pname] = { "pid": x.pid, "cid": x.cid };
		}

		if (!(category_name in categories)) {
			throw "Error. Category name: " + category_name + " does not exists.";
		} else {
			reply = mock_data.result_file_system.data[0]
			var res = nock("http://dynamodb.us-east-1.amazonaws.com")
				.post("/catalog")
				.reply(200, JSON.stringify(reply));

			let response = await got_service.post_request("http://dynamodb.us-east-1.amazonaws.com/catalog", "");
			return "File '" + file_name + "' has been added under the category '" + category_name + "'.";
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
		return err;
	}
}

async function showFilesOfACategory(category_name, data) {
	try {
		reply = mock_data.dynamoDB.catalog
		var res = nock("http://dynamodb.us-east-1.amazonaws.com/catalog")
			.get("")
			.reply(200, reply);

		let temp = await slack_bot_service.get_json_data_from_url("http://dynamodb.us-east-1.amazonaws.com/catalog");

		categories = {};
		var pid = 0;
		var channel_id = data.channel
		for (const x of temp) {
			categories[x.pname] = { "pid": x.pid, "cid": x.cid };
			if (x.pname === category_name) {
				pid = x.pid;
			}
		}

		if (!(category_name in categories)) {
			throw "Error. Category name: " + category_name + " does not exists.";
		} else {
			var ans = "";
			reply = mock_data.dynamoDB.file_system
			var res = nock("http://dynamodb.us-east-1.amazonaws.com/file_system")
				.get("")
				.reply(200, reply);

			let temp = await slack_bot_service.get_json_data_from_url("http://dynamodb.us-east-1.amazonaws.com/file_system");

			for (const x of temp) {
				if (x.catalog_id == pid) {
					// && channel_id == x.channel_id
					ans = ans + " " + x.file_name + ",";
				}
			}

			return "Files under the category '" + category_name + "' are " + ans;
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
		return err;
	}
}

async function exportDeleteCategory(category_name, storage_name, data, is_export) {
	try {
		var data = mock_data.file_list.files
		const scope = nock("https://api.slack.com/files.list")
			.log(console.log)
			.get("")
			.reply(200, data);

		let temp1 = await slack_bot_service.get_json_data_from_url("https://api.slack.com/files.list");

		file_data = {}

		for (const x of temp1) {
			file_data[x.name] = { "id": x.id, "url": x.url_private_download };
		}

		reply = mock_data.dynamoDB.catalog
		var res = nock("http://dynamodb.us-east-1.amazonaws.com/catalog")
			.get("")
			.reply(200, reply);

		let temp = await slack_bot_service.get_json_data_from_url("http://dynamodb.us-east-1.amazonaws.com/catalog");

		category_id = -1;
		for (const x of temp) {
			if (x.pname == category_name) {
				category_id = x.pid
				break;
			}
		}

		reply = mock_data.dynamoDB.file_system
		var res = nock("http://dynamodb.us-east-1.amazonaws.com/file_system")
			.get("")
			.reply(200, JSON.stringify(reply));

		let temp2 = await slack_bot_service.get_json_data_from_url("http://dynamodb.us-east-1.amazonaws.com/file_system");

		var files_to_move = []
		for (const x of temp2) {
			if (x.catalog_id == category_id) {
				files_to_move.push(file_data[x.file_name]);
			}
		}

		if (category_id === -1) {
			throw "Error. Category name: " + category_name + " does not exists.";
		} else {
			var i = 0;
			var len = files_to_move.length;

			for (i = 0; i < len; i++) {
				if (is_export) {
					reply = mock_data.result_google_drive.output[i]
					var res = nock("https://www.googleapis.com")
						.post("/upload/drive/v3/files", { uploadType: 'media', url: files_to_move[i].url })
						.reply(200, JSON.stringify(reply));

					let response1 = await got_service.post_request("https://www.googleapis.com/upload/drive/v3/files",
						{ uploadType: 'media', url: files_to_move[i].url });
				}


				reply = mock_data.slack_delete_output
				nock("https://api.slack.com")
					.post("/files.delete", { "file": files_to_move[i].id })
					.reply(200, JSON.stringify(reply));

				let response2 = await got_service.post_request("https://api.slack.com/files.delete", { "file": files_to_move[i].id });
			}

			if (is_export) {
				return "Files of category '" + category_name + "' have been moved to external storage.";
			} else {
				return "Files of category '" + category_name + "' have been deleted.";
			}
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
		return err;
	}
}

module.exports.setCategory = setCategory;
module.exports.getCategories = getCategories;
module.exports.addFileToCategory = addFileToCategory;
module.exports.showFilesOfACategory = showFilesOfACategory;
module.exports.exportDeleteCategory = exportDeleteCategory;

