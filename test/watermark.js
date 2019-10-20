/* test/watermark.js */

var controller = require('../src/controller/watermark_controller.js');
var expect = require('chai').expect;
const nock = require("nock");

// Load mock data
const data = require("../mock.json")
const env = Object.assign({}, process.env);

describe('testWaterMark', function () {
  // before(function() {
  //   // runs before all tests in this block
  //   process.env.SLACK_TOKEN = 'xoxb-775571702198-775695559382-MSox8rQEc2qhmuGa9wz3JiNJ';
  // });

  describe('#init()', function () {

    it('should create a new file with watermark added', async function () {
      // process.env.SLACK_TOKEN = 'xoxb-775571702198-775695559382-MSox8rQEc2qhmuGa9wz3JiNJ';
      var response = await controller.init(data.watermarks[0]);
      console.log("here");
      console.log(response);
    });
  });
});


