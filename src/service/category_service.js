var slack_bot_service = require('./slack_bot_service');
var slack = slack_bot_service.slack
var got_service = require('./got_service');
const nock = require("nock");
const mock_data = require("../mock.json")
const got  = require('got');

var category_map = {};

async function get_all_data_for_catalog() {
	reply = mock_data.dynamoDB.catalog
	var res = nock("http://dynamodb.us-east-1.amazonaws.com")
			    .get("/catalog")
			    .reply(200, JSON.stringify(reply));

	let response = await got_service.get_request("http://dynamodb.us-east-1.amazonaws.com/catalog");
	return response;
}

async function get_all_files_data() {
	reply = mock_data.dynamoDB.file_system
	var res = nock("http://dynamodb.us-east-1.amazonaws.com")
			    .get("/file_system")
			    .reply(200, JSON.stringify(reply));

	let response = await got_service.get_request("http://dynamodb.us-east-1.amazonaws.com/file_system");
	return response;
}

async function setCategory(category_name, data) {
	// set the global to DynamoDB
	try {
		var response = await get_all_data_for_catalog().then((res) =>res);
		categories = {};
		for (const x of response){
	  		categories[x.pname] = {"pid": x.pid, "cid": x.cid};
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
	catch(err) {
		console.log("Error Occurred: ", err);
    	return err;
  	}
}

async function getCategories() {
	// get the categories from DynamoDB
	var response = await get_all_data_for_catalog().then((res) =>res);
	categories = {};
	var ans = "";
	for (const x of response){
  		categories[x.pname] = {"pid": x.pid, "cid": x.cid};
  		ans = ans + " " + x.pname + ",";
  	}
	return "Categories are: " + ans;
}

async function addFileToCategory(category_name, file_name, data) {
	try {
		var response = await get_all_data_for_catalog().then((res) =>res);
		categories = {};
		for (const x of response){
	  		categories[x.pname] = {"pid": x.pid, "cid": x.cid};
	  	}

		if(!(category_name in categories)) {
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
		var response = await get_all_data_for_catalog().then((res) =>res);
		categories = {};
		var pid = 0;
		var channel_id = data.channel
		for (const x of response){
	  		categories[x.pname] = {"pid": x.pid, "cid": x.cid};
	  		if (x.pname === category_name) {
	  			pid = x.pid;
	  		}
	  	}

		if(!(category_name in categories)) {
			throw "Error. Category name: " + category_name + " does not exists.";
		} else {
			var ans = "";
			var response = await get_all_files_data().then((res) =>res);
			for (const x of response){
		  		if(x.catalog_id == pid && channel_id == x.channel_id) {
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

async function get_all_files_from_slack() {
	var data = mock_data.file_list.files
	var res1 = nock("https://api.slack.com/files.list")
		.get("")
		.reply(200, data);

	let response = await got_service.get_request("https://api.slack.com/files.list");
	// let response = await slack_bot_service.get_json_data_from_url("https://api.slack.com/files.list");

	return response;
}

async function exportDeleteFile(file_name, storage_name, data, is_export) {
	try {
		var response = await get_all_files_from_slack().then((res) =>res);

		// var response = await get_all_files_from_slack();

		// let response = await got_service.get_request("https://api.slack.com/files.list");


	// 	var data = mock_data.file_list.files
	// const scope = nock("https://slack.com/files.list")
	// .persist()
	// 	.log(console.log)
	// 	.get("")
	// 	.reply(200, data);

	// let response = await slack_bot_service.get_json_data_from_url("https://slack.com/files.list");

	// 	scope.persist(false);



		file_data = {}

		console.log(response)

		for(const x of response) {
			if(x.name == file_name) {
				file_data[file_name] = {"id": x.id, "url": x.url_private_download};
				break;
			}
		}

		if (Object.keys(file_data).length === 0) {
			throw "Error. File name: " + file_name + " does not exists.";
		} else {

			if (is_export) {
				reply = mock_data.result_google_drive.output[0]
				var res = nock("https://www.googleapis.com")
					.post("/upload/drive/v3/files", {uploadType:'media', url: file_data[file_name].url})
			      	.reply(200, JSON.stringify(reply));

				let response1 = await got_service.post_request("https://www.googleapis.com/upload/drive/v3/files", 
					{uploadType:'media', url: file_data[file_name].url});
			}
			

			reply = mock_data.slack_delete_output
			nock("https://api.slack.com")
					.post("/files.delete", {"file": file_data[file_name].id})
			      	.reply(200, JSON.stringify(reply));

			let response2 = await got_service.post_request("https://api.slack.com/files.delete", {"file": file_data[file_name].id});

		if (is_export) {
			return "File '" + file_name + "' has been moved to external storage.";
		} else {
			return "File '" + file_name + "' has been deleted.";
		}

		 
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
    	return err;
	}
}

async function exportDeleteCategory(category_name, storage_name, data, is_export) {
	try {
		var response = await get_all_files_from_slack().then((res) =>res);
		file_data = {}

		for(const x of response) {
			file_data[x.name] = {"id": x.id, "url": x.url_private_download};
		}

		var response = await get_all_data_for_catalog().then((res) =>res);
		category_id = -1;
		for (const x of response){
			if (x.pname == category_name) {
				category_id = x.pid
				break;
			}
	  	}

	  	var response = await get_all_files_data().then((res) =>res);
	  	var files_to_move = []
		for (const x of response){
	  		if(x.catalog_id == category_id) {
	  			files_to_move.push(file_data[x.file_name]);
	  		}
	  	}

	  	if(category_id === -1) {
	  		throw "Error. Category name: " + category_name + " does not exists.";
	  	} else {
	  		var i=0;
	  		var len = files_to_move.length;\

	  		for(i=0; i < len; i++) {
	  			if(is_export){
	  				reply = mock_data.result_google_drive.output[i]
					var res = nock("https://www.googleapis.com")
						.post("/upload/drive/v3/files", {uploadType:'media', url: files_to_move[i].url})
				      	.reply(200, JSON.stringify(reply));

					let response1 = await got_service.post_request("https://www.googleapis.com/upload/drive/v3/files", 
						{uploadType:'media', url: files_to_move[i].url});
	  			}
	  			

				reply = mock_data.slack_delete_output
				nock("https://api.slack.com")
						.post("/files.delete", {"file": files_to_move[i].id})
				      	.reply(200, JSON.stringify(reply));

				let response2 = await got_service.post_request("https://api.slack.com/files.delete", {"file": files_to_move[i].id});
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
module.exports.exportDeleteFile = exportDeleteFile;
module.exports.exportDeleteCategory = exportDeleteCategory;

