var db_service = require('../dbservice/category_dbservice')
var slack_bot_service = require('./slack_bot_service');
var bot = slack_bot_service.bot;

async function setCategory(category_name, data) {

	var obj = {
		name: category_name,
		channel: data.channel
	}
	var result = await db_service.create(obj).then((res) => res);
	return result

}

async function getCategories(channel_name) {
	var category_list = await db_service.get_all(channel_name).
		then((res) => {
			if (res.length > 0) {
				var list = res.map(a => a.Item.name);
				return Promise.resolve('Categories for this channel are: ' + list.join())
			}
			else {
				return Promise.resolve('No watermark registered');
			}
		});
	return category_list
}

async function addFileToCategory(category_name, file_name, data) {

}

async function showFilesOfACategory(category_name, data) {

}



module.exports.setCategory = setCategory;
module.exports.getCategories = getCategories;
module.exports.addFileToCategory = addFileToCategory;
module.exports.showFilesOfACategory = showFilesOfACategory;

