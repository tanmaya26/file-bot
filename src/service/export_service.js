var export_dbservice = require('../dbservice/export_dbservice')
var db_service = require('../dbservice/category_dbservice')
var slack_bot_service = require('./slack_bot_service');
var utils_service = require('./utils_service');

async function deleteCategoryFiles(category_name, data) {
	try {
		var items = [];
		var category_exists = await utils_service.checkIfCategoryExists(category_name, data.channel);
		if (category_exists == false) {
			return "No category with the name '" + category_name + "' exists";
		}
		else {
			var files = await db_service.get_files(category_name, data.channel).then((res) => {
				res.Items.forEach(file => {
					items.push(file.file_id);
				});
				return Promise.resolve(items);
			});

			var i = 0;
			for(i = 0; i < files.length; i++) {
				await slack_bot_service.delete_file_from_slack("https://slack.com/api/files.delete", files[i]).
							then((res) => res);
				await export_dbservice.delete_file_record(files[i]).then((res) => res);
			}

			return "Files of category '" + category_name + "' have been deleted.";
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
    	return err;
	}
}

module.exports.deleteCategoryFiles = deleteCategoryFiles;
