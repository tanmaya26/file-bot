var AWS = require("aws-sdk");
var creds = new AWS.Credentials('ASIA23XI3UCH57IW2657',
    '1PPH8dPASFURsXw0ILL9Sxun3foNJgWwc8T21i4g',
    'FQoGZXIvYXdzEN7//////////wEaDAkoFUecIn5czYo40yL/AeTP184RPBIpBAFzgHjFoEsMCxJC9Y6YCLjjBYx2QunZFeb8kyWCwYoeVVMo1fIePZA7Caquk8qr/J0pQ8IiQM0zkdNUfJUlcBt3Y2TqI7g+C8HV1FVLNwRzmrlUOvRRFvRe2l77J+8iQWip+1LD8JgON6oXEy1vrTrfn+66G6oeIXz6JeXJQvEBDQRg+DtBAszc+0Vk9Rq5ZE6mEFsKpdJDa9VVM0Z8Tls4JiT5cEwSDjlYEUihQUHxdXNAjnkDHeC7gf2ksbSNglJ1KhdZD6QERImRm3IYgn7tfHHKoEQX/LgROFVK3V/FVkvO0eDiFAXf+dm8a/VdOGl5V/OsnijvlbPtBQ==');
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
                resolve(data);
            }
        })
    });
}

module.exports.create = create;
module.exports.get = get;