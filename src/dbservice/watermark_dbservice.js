var AWS = require("aws-sdk");
var creds = new AWS.Credentials('ASIA23XI3UCH7PJ2GU5V',
    'pAELQ+v2kYhhO/XTEVY5tf9POBiVuUQsuvlomcy5',
    'FQoGZXIvYXdzENz//////////wEaDPxl2GBwdQMfRmg5riL/AWD7W2Ay9m0bzES42EX0UsCsKXOctwBSOPN2bYjaBiTW6qnEdUoCIDgd3F2g3Rk6emf+3vJP/tWzTaHKMk0JMfNgTcgbbw5QsVrYuv0LWXnwzoRhgpKAP4AmSSQNB/jjYF66ED27UdcB+FpGqXqNs1+8a6SmvXdjjLfT+jJPP+Q/g4ONl922nTaJWIkw3Xl9SD3H0CQ08JFv3NNjdyhvM+tnKIiXLlL08Nwyf0HYlTcil3ueWGB1d9N5v2n9h7EBiYFoMH4rOHUcYQ4wUZxjdkFLaiY8+0CQwcg2iBUxqvtvyIMDFJjd7pF3aKaXydhP4+MpKrZydkrpzByREROqaCiO0bLtBQ==');
AWS.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com",
    credentials: creds
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "watermark";

function create(create_obj) {
    var params = {
        TableName: table,
        Item: {
            "name": create_obj.name,
            "channel": create_obj.channel,
            "url": create_obj.url
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
}

async function get(watermark_name, channel_name) {
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
                if (typeof data.Item != 'undefined') {
                    resolve(data);
                }
                else{
                    reject(new Error('Could not find the watermark'));
                }
            }
        })
    });
}

module.exports.create = create;
module.exports.get = get;