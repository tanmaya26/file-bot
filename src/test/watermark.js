/* test/watermark.js */
require('dotenv').config();
var controller = require('../controller/watermark_controller.js');
var utils_service = require('../service/utils_service');
var expect = require('chai').expect;
var AWS = require('aws-sdk-mock');
const nock = require("nock");

// Load mock data
const data = require("../mock.json")

describe('testWaterMark', function () {
  describe('#init()', function () {

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
        expect(response).to.equal('Only one file should be associated with the command. Upload only one file to create watermark.')
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
        AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
          callback(null, data.get_watermark_result_undefined);
        });

        cmd = utils_service.split_command(data.watermark_commands[0])
        var response = await controller.init(cmd, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('Watermark created successfully.')
        AWS.restore('DynamoDB.DocumentClient');
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should fail to register the watermark as a watermark with same name exists', async function () {
      try {
        AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
          callback(null, data.get_watermark_result);
        });

        cmd = utils_service.split_command(data.watermark_commands[6])
        var response = await controller.init(cmd, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('Watermark with name wm2 already exists')
        AWS.restore('DynamoDB.DocumentClient');
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

    it('it should return a message for not providing an associated PDF file for text watermark', async function () {
      try {
        cmd = utils_service.split_command(data.watermark_commands[3])
        var response = await controller.init(cmd, data.watermarks[2]).then((res) => res);
        expect(response).to.equal('No file associated with command. Upload a PDF file with command watermark the file.')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return a message for not providing a text for watermark', async function () {
      try {
        cmd = utils_service.split_command(data.watermark_commands[4])
        var response = await controller.init(cmd, data.watermarks[1]).then((res) => res);
        expect(response).to.equal('Please Provide a text for this watermark.')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should list all the watermarks in the channel', async function () {
      try {
        AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
          callback(null, data.get_all_watermarks_result);
      });

        cmd = utils_service.split_command(data.watermark_commands[5])
        var response = await controller.init(cmd, data.watermarks[2]).then((res) => res);
        expect(response).to.equal('Watermarks for this channel are: wm1,wm2,wm3')
        AWS.restore('DynamoDB.DocumentClient');
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return a message for not providing an associated PDF file with image watermark', async function () {
      try {
        cmd = utils_service.split_command(data.watermark_commands[2])
        var response = await controller.init(cmd, data.watermarks[2]).then((res) => res);
        expect(response).to.equal('No file associated with command. Upload a PDF file with command watermark the file.')
      }
      catch (e) {
        console.log(e)
      }
    });

  });
});


