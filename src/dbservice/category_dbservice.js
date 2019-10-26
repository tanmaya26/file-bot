
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
                var res = "Category registered.";
                resolve(res);
            }
        });
    });
}

async function get_all(channel_name) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "category",
        IndexName: "ChannelIndex",
        KeyConditionExpression: "channel = :a",
        ExpressionAttributeValues: {
            ":a": channel_name
        }
    };
    return await new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                console.log(data);
                resolve(data);
            }
        })
    });
}

async function add_file(files, channel_name, category_name) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "files",
        Item: {
            "channel_name": channel_name,
            "category_name": category_name,
            "files": files
        }
    };
    return await new Promise((resolve, reject) => {
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                var res = "File added to category.";
                resolve(res);
            }
        });
    });
}



module.exports.create = create;
module.exports.get_all = get_all;
module.exports.add_file = add_file;