var slack_bot_service = require('./slack_bot_service');
var slack = slack_bot_service.slack
var got_service = require('./got_service');
const nock = require("nock");
const mock_data = require("../../mock.json")
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

module.exports.setCategory = setCategory;
module.exports.getCategories = getCategories;
module.exports.addFileToCategory = addFileToCategory;
module.exports.showFilesOfACategory = showFilesOfACategory;
