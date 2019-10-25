
var AWS = require("aws-sdk");

var table = "category";
async function create(obj) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: table,
        Item: {
            "name": obj.name,
            "channel": obj.channel,
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

async function get_all(channel_name) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            "channel": channel_name
        }
    };
    return await new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
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
module.exports.get_all = get_all;