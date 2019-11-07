var AWS = require("aws-sdk");
var creds = new AWS.Credentials(process.env.ACCESS_KEY,
    process.env.SECRET_KEY,
    process.env.SESSION_KEY);
AWS.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com",
    credentials: creds
});

var table = "storage";

async function getCurrentSize(channel) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            "channel_id": channel
        }
    };
    Console.log("Getting curent size")
    return await new Promise((resolve, reject) => {
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read current size item. Error JSON:", JSON.stringify(err, null, 2));
                reject(-1);
            } else {
                console.log("Getting Current Size Item succeeded:", JSON.stringify(data.Item.current_size, null, 2));
                resolve(data.Item.current_size);
            }
        })
    });
}

async function setCurrentSize(channel,size) {

    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: table,
        Key: {
            "channel_id": channel
        },
        UpdateExpression: "set current_size = :c",
        ExpressionAttributeValues: {
            ":c": size 
        },
        ReturnValues:"UPDATED_NEW"
    }; 

    console.log("Updating current size");
    return await new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update current size item. Error JSON:", JSON.stringify(err, null, 2));
                reject(false);
            } else {
                console.log("Updateing current size item succeeded:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

async function setAlertSize(channel, size) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: table,
        Key: {
            "channel_id": channel
        },
        UpdateExpression: "set limit_size = :l",
        ExpressionAttributeValues: {
            ":l": size 
        },
        ReturnValues:"UPDATED_NEW"
    }; 

    console.log("Updating alert limit size");
    return await new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update alert limit item. Error JSON:", JSON.stringify(err, null, 2));
                reject(false);
            } else {
                console.log("Updated alert item successfully:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

async function getAlertSize(channel) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            "channel_id": channel
        }
    };
    console.log("Getting alert limit size")
    return await new Promise((resolve, reject) => {
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read alert limit item. Error JSON:", JSON.stringify(err, null, 2));
                reject(-1);
            } else {
                console.log("Get alert limit item succeeded:", JSON.stringify(data.Item.limit_size, null, 2));
                resolve(data.Item.limit_size);
            }
        })
    });
}

async function createChannelItem(channel_id, limit_size, current_size) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: table,
        Item: {
            "channel_id": channel_id,
            "limit_size": limit_size,
            "current_size": current_size
        }
    };
    
    console.log("Adding a new channel...");
    return await new Promise((resolve, reject) => {
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add channel item. Error JSON:", JSON.stringify(err, null, 2));
                reject(false);
            } else {
                console.log("Added channel item:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

module.exports.getAlertSize = getAlertSize;
module.exports.setAlertSize = setAlertSize;
module.exports.getCurrentSize = getCurrentSize;
module.exports.setCurrentSize = setCurrentSize;
module.exports.createChannelItem = createChannelItem;
