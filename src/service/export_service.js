const util = require('util')
var export_dbservice = require('../dbservice/export_dbservice')
var db_service = require('../dbservice/category_dbservice')
var slack_bot_service = require('./slack_bot_service');
var utils_service = require('./utils_service');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var mime = require('mime-types');
var bot = slack_bot_service.bot;

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file',
'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.metadata'];
const TOKEN_PATH = 'token.json';

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
			await export_dbservice.delete_category_record(category_name, data.channel).then((res) => res);

			return "Files of category '" + category_name + "' have been deleted.";
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
    	return err;
	}
}

async function exportCategory(category_name, data) {
	var res = JSON.parse(fs.readFileSync('credentials.json'))
	var result = await authorize(res, category_name, data, exporting).then((res) => res);
	return result;
}

async function create_folder(auth, category_name) {
	const drive = google.drive({version: 'v3', auth});
	var folder_id = ""
	var fileMetadata = {
	  'name': category_name,
	  'mimeType': 'application/vnd.google-apps.folder'
	};
	await drive.files.create({
	  resource: fileMetadata,
	  fields: 'id'
	}).then(function (response) {
		folder_id = response.data.id
		console.log('Folder created Successfully:', response.data.id);
	})
	.catch(function (err) {
		console.log('Failed to create folder:', err);
	});
	return folder_id
}

async function exporting(auth, category_name, data) {
	try {
		const drive = google.drive({version: 'v3', auth});
		var items = [];
		var category_exists = await utils_service.checkIfCategoryExists(category_name, data.channel);
		if (category_exists == false) {
			return "No category with the name '" + category_name + "' exists";
		}
		else {
			var files = await db_service.get_files(category_name, data.channel).then((res) => {
				res.Items.forEach(file => {
					var x = {"url": file.file_url, "id": file.file_id, "name": file.file_name, "type": file.file_type}
					items.push(x);
				});
				return Promise.resolve(items);
			});

			var folder_id = await create_folder(auth, category_name).then((fid)=>fid)

			var i = 0;
			for(i = 0; i < files.length; i++) {
				const buffer = await slack_bot_service.get_slack_resource_from_url(files[i]["url"])
				var local_path = "temp_files/" + files[i]["name"]
				var name = files[i]["name"]
				var file_type = files[i]["type"]
				var file_id = files[i]["id"]
				fs.writeFile(local_path , new Buffer(buffer), async function (err, result) { 
					var fileMetadata = {
						'name': name,
						parents: [folder_id]
					};
					var mime_type = mime.lookup(file_type);
					var media = {
						mimeType: mime_type,
						body: fs.createReadStream(local_path)
					};
					await drive.files.create({
						resource: fileMetadata,
						media: media,
						fields: 'id'
					  }).then(function (response) {
							console.log('Exported Successfully:', response.data.id);
						})
						.catch(function (err) {
							console.log('Failed to export:', err);
						});
				});
				await slack_bot_service.delete_file_from_slack("https://slack.com/api/files.delete", 
								file_id).then((res) => res);
				await export_dbservice.delete_file_record(file_id).then((res) => res);
			}
			await export_dbservice.delete_category_record(category_name, data.channel).then((res) => res);

			return "Files of category '" + category_name + "' have been exported.";
		}
	} catch (err) {
		console.log("Error Occurred: ", err);
    	return err;
	}
}

async function authorize(credentials, category_name, data, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
	try {
	  var res = JSON.parse(fs.readFileSync(TOKEN_PATH))
	  oAuth2Client.setCredentials(res);
	  var result = await callback(oAuth2Client, category_name, data).then((res) => res);
  		return result;
	} catch(err) {
	  getAccessToken(oAuth2Client, callback, category_name, data);
	}
}

function getAccessToken(oAuth2Client, callback, category_name, data) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client, category_name, data).then((res) => bot.postMessage(data.channel, res));
    });
  });
}

module.exports.deleteCategoryFiles = deleteCategoryFiles;
module.exports.exportCategory = exportCategory;
