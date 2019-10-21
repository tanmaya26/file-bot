var AWS = require("aws-sdk");
var AWSMOCK = require('aws-sdk-mock');
const MOCK_DATA = require("../mock.json")

AWSMOCK.mock('DynamoDB.DocumentClient', 'put', function (params, callback){
    callback(null, "successfully put item in database");
  });

  AWSMOCK.mock('DynamoDB.DocumentClient', 'get', function (params, callback){
    callback(null, MOCK_DATA.get_watermark_result);
  });

var table = "watermark";

async function create(create_obj) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: table,
        Item: {
            "name": create_obj.name,
            "channel": create_obj.channel,
            "url": create_obj.url
        }
    };

    console.log("Adding a new item...");
    return await new Promise((resolve, reject) => {
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

async function get(watermark_name, channel_name) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            "name": watermark_name,
            "channel": channel_name
        }
    };
    return await new Promise((resolve, reject) => {
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        })
    });
}

module.exports.create = create;
module.exports.get = get;