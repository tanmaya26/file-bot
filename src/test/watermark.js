/* test/watermark.js */

var controller = require('../controller/watermark_controller.js');
var utils_service = require('../service/utils_service');
var expect = require('chai').expect;
var AWS = require('aws-sdk-mock');
const nock = require("nock");

// Load mock data
const data = require("../mock.json")
const env = Object.assign({}, process.env);

describe('testWaterMark', function () {
  describe('#init()', function () {

    it('it should return a message for wrong format of file', async function () {
      try {
        cmd = utils_service.split_command(data.watermark_commands[0])
        var response = await controller.init(cmd, data.watermarks[1]).then((res) => res);
        expect(response).to.equal('Wrong format for file . Watermark only accepts .png files')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return a message for providing watermark name', async function () {
      try {
        cmd = utils_service.split_command(data.watermark_commands[1])
        var response = await controller.init(cmd, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('Please Provide a name for this watermark')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should register the watermark successfully', async function () {
      try {
        AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
          callback(null, "successfully put item in database");
        });

        cmd = utils_service.split_command(data.watermark_commands[0])
        var response = await controller.init(cmd, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('Watermark created successfully.')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return a message for not providing an associated file with create watermark', async function () {
      try {
        cmd = utils_service.split_command(data.watermark_commands[0])
        var response = await controller.init(cmd, data.watermarks[2]).then((res) => res);
        expect(response).to.equal('No file associated with command. Upload a PNG file with command to create watermark.')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return a message for providing more than one associated files with create watermark', async function () {
      try {
        cmd = utils_service.split_command(data.watermark_commands[0])
        var response = await controller.init(cmd, data.watermarks[3]).then((res) => res);
        expect(response).to.equal('Only one file should be associated with the command. Upload only file to create watermark.')
      }
      catch (e) {
        console.log(e)
      }
    });

  });
});


