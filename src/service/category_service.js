var slack_bot_service = require('./slack_bot_service');
var slack = slack_bot_service.slack
var category_map = {};

function setCategory(category_name, data) {
	// set the global to DynamoDB
	console.log("here72782387278");
	try {
		if (category_name in category_map) {
			throw "Error. Category name already exists."
		} else {
			category_map[category_name] = [];
			return "Category has been added."
		}
	} 
	catch(err) {
		console.log("Error Occurred: ", err);
    	return err;
  	}
}

function getCategories() {
	// get the categories from DynamoDB
	return "Categories are " + JSON.stringify(Object.keys(category_map));
}

function addFileToCategory(category_name, file_name, data) {
	try {
		if(!(category_name in category_map)) {
			throw "Error. Category name: " + category_name + " does not exists.";
		} else {
			category_map[category_name].push(file_name);
			return "File has been added under the category '" + category_name + "'.";
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
    	return err;
	}
}

function showFilesOfACategory(category_name, data) {
	try {
		if(!(category_name in category_map)) {
			throw "Error. Category name: " + category_name + " does not exists.";
		} else {
			return "Files under the category '" + category_name + "' are " + JSON.stringify(category_map[category_name]);
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
