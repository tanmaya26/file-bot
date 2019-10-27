var db_service = require('../dbservice/category_dbservice')
var slack_bot_service = require('./slack_bot_service');
var bot = slack_bot_service.bot;

async function setCategory(category_name, channel_name) {

	var obj = {
		name: category_name,
		channel: channel_name
	}

	var category_exists = await checkIfCategoryExists(category_name, channel_name)
	if (category_exists == false) {
		var result = await db_service.create(obj).then((res) => res)
		return result
	}
	else {
		return 'Category with name ' + category_name + " already exists in this channel"
	}

}

async function getCategories(channel_name) {
	var category_list = await db_service.get_all(channel_name).
		then((res) => {
			if (res.Count > 0) {
				var list = res.Items.map(a => a.name);
				return Promise.resolve('Categories for this channel are: ' + list.join())
			}
			else {
				return Promise.resolve("No category registered.");
			}
		});
	return category_list
}

async function addFileToCategory(category_name, data) {
	var channel_name = data.channel;
	var category_exists = await checkIfCategoryExists(category_name, channel_name)
	if (category_exists == false) {
		return 'No category with the name ' + category_name + " exists"
	}
	else {
		var result = await db_service.add_file(data, channel_name, category_name).
		then((res) => res);
	return result
	}
}

async function showFilesOfACategory(category_name, data) {
	var files = await db_service.get_files(category_name, data.channel).then((res) => {
		
	});

}

async function checkIfCategoryExists(category_name, channel_name){
	var category_exists = await db_service.get(category_name, channel_name).
	then((res) => {
		if (typeof res.Item != 'undefined') {
			return true;
		}
		else {
			return false
		}
	});
	return category_exists
}

module.exports.setCategory = setCategory;
module.exports.getCategories = getCategories;
module.exports.addFileToCategory = addFileToCategory;
module.exports.showFilesOfACategory = showFilesOfACategory;

