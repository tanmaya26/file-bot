// Loading ENV vars
require('dotenv').config();

var watermark_controller = require('./controller/watermark_controller');
var slack_bot_service = require('./service/slack_bot_service');
var utils_service = require('./service/utils_service');
var storage_limit_controller = require('./controller/storage_limit_controller');
var category_controller = require('./controller/category_controller');
var export_controller = require('./controller/export_controller');
var drive_dbservice = require('./dbservice/drive_dbservice');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8000

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.post('/', (req, res) => {
	res.send('Please follow the instructions.')
	const body = req.body
	export_controller.openModalToRegisterGoogleDrive(body.trigger_id)
})

app.post('/registerGoogleDrive', (req, res) => {
	res.send('')
	const body = req.body
	var input = JSON.parse(body.payload).view.state.values
	console.log(input)
	obj = {
		private_key: input.inp1.sl_input_1.value,
		client_email: input.inp2.sl_input_2.value,
		drive_name: input.inp3.sl_input_3.value,
		access_folder_id: input.inp4.sl_input_4.value
	}
	drive_dbservice.registerDrive(obj)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
var slack = slack_bot_service.slack

// creating a bot, for more options check: https://github.com/mishk0/slack-bot-api
var bot = slack_bot_service.bot

// Load bot id
var bot_id = slack_bot_service.bot_id

bot.on('start', function () {
	//Do something when the BOT starts 

	console.log('BOT started listening...');
});


// Event to listen all slack messages, to see all possible events check: https://api.slack.com/events-api
bot.on('message', function (data) {

	if (typeof data.text != 'undefined') {
		cmd = utils_service.split_command(data.text)
		if (cmd[0] == bot_id) {
			cmd.shift()
			if (cmd[0] == '--watermark') {
				watermark_controller.init(cmd, data)
			} else if (cmd[0] == '--setStorageSize') {
				storage_limit_controller.setAlertSize(cmd[1], data);
			} else if (cmd[0] == '--getStorageSize') {
                storage_limit_controller.getAlertSize(data);
            } else if (cmd[0] == '--getCurrentSize') {
				storage_limit_controller.getCurrentSize(data);
			} else if (cmd[0] == '--registerCategory') {
				category_controller.setCategory(cmd[1], data);
			} else if (cmd[0] == '--getCategories') {
				category_controller.getCategories(data);
			} else if (cmd[0] == '--addToCategory') {
				category_controller.addFileToCategory(cmd[1], data);
			} else if (cmd[0] == '--showFiles') {
				category_controller.showFilesOfACategory(cmd[1], data);
			} else if (cmd[0] == '--deleteCategory') {
				export_controller.deleteCategoryFiles(cmd[1], data);
			} else if (cmd[0] == '--exportCategory') {
				export_controller.exportCategory(cmd[1], cmd[2], data);
			}
		}
	}
	storage_limit_controller.listenForFileActivity(data);
});
