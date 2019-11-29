/* test/watermark.js */
require('dotenv').config();
var controller = require('../controller/storage_limit_controller.js');
var utils_service = require('../service/utils_service');
var expect = require('chai').expect;
var AWS = require('aws-sdk-mock');
const nock = require("nock");

// Load mock data
const data = require("../mock.json")

describe('testStorageLimit', function () {
  describe('#init()', function () {

    it('it should return a message for setting storage limit', async function () {
      try {
        cmd = utils_service.split_command("--setStorageSize 3.5")
        size = cmd[cmd.size-1]
        AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
          callback(null, "successfully put item in database");
        });
        AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
          callback(null, data.dynamoDB.storage[0].size);
        });
        var response = await controller.setAlertSize(size, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('New Alert Limit has been set to 3.5 GB.')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return a message for providing incorrect size format', async function () {
      try {
        cmd = utils_service.split_command("--setStorageSize six")
        size = cmd[cmd.size-1]
        var response = await controller.setAlertSize(size, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('Please enter a number for storage size(in GB).')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return an error message for setting limit greater than 5', async function () {
      try {
       
        cmd = utils_service.split_command("--setStorageSize 6")
        size = cmd[cmd.size-1]
        var response = await controller.setAlertSize(size, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('Error. Size limit cannot be more than 5.0')
      }
      catch (e) {
        console.log(e)
      }
    });

    it('it should return a message for current storage limit', async function () {
      try {
        AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
          callback(null, data.dynamoDB.storage[0].size);
        });
        cmd = utils_service.split_command("--getStorageSize")
        var response = await controller.getAlertSize(cmd, data.watermarks[0]).then((res) => res);
        expect(response).to.equal('Current size limit is 3.5 GB')
      }
      catch (e) {
        console.log(e)
      }
    });  
  });
});


