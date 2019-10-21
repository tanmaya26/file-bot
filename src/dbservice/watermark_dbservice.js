var AWS = require("aws-sdk");
var creds = new AWS.Credentials('ASIA23XI3UCH246SYUPB',
    '1Yi32fp+sfS5yjg0GKFSz2z4zHQVFRMrAyukticC',
    'FQoGZXIvYXdzEOX//////////wEaDLOY2ip1zlWXwXse1CL/AZ+0ArNN3FQMPyEd2Vm6Fy/ItmrlcG2N3hTbRUB93GLQwxKpMBy6h894L6L316bHW+KXUNPdDpiCEPTMnVkBKqywewIyLcQ4dobaNKXgdVqO85120NExQS2MikTft4fpRSczFDEyvC7zsp9QXt529317WA8NMKasNkRuZN4WXerOOzLg7CHypJkdLVuW46yV7JnxxXevroveoerw5vsSGXmW8HzHQScpsDDDViqYKijwBE10bgzWWEsHTXvZE1xG1vBH+mQs1hhzNzQUFz0Zj92AeCnFJh5NxDnR83CwLtTMAMYqlkkG6byDTPZro3IGz5Hk5al5DKKx/lzk4OcvOijG2rTtBQ==');
AWS.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com",
    credentials: creds
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