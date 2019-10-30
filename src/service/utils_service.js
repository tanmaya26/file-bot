var db_service = require('../dbservice/category_dbservice')

function split_command(command) {
    return command.split(" ");
}

function get_file_extension(filename) {
    return filename.split('.').pop();
}

async function checkIfCategoryExists(category_name, channel_name) {
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

module.exports.split_command = split_command;
module.exports.get_file_extension = get_file_extension;
module.exports.checkIfCategoryExists = checkIfCategoryExists;