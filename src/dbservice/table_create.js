var AWS = require("aws-sdk");
var creds = new AWS.Credentials(process.env.ACCESS_KEY,
    process.env.SECRET_KEY,
    process.env.SESSION_KEY);
AWS.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com",
    credentials: creds
});

var dynamodb = new AWS.DynamoDB();

var water_mark_params = {
    TableName: "watermark",
    KeySchema: [
        { AttributeName: "name", KeyType: "HASH" },  //Partition key
        { AttributeName: "channel", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "name", AttributeType: "S" },
        { AttributeName: "channel", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

var storage_table_params = {
    TableName: "storage",
    KeySchema: [
        { AttributeName: "channel", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "channel", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

var category_table_params = {
    TableName: "category",
    KeySchema: [
        { AttributeName: "name", KeyType: "HASH" },  //Partition key
        { AttributeName: "channel", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "name", AttributeType: "S" },
        { AttributeName: "channel", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [{
        IndexName: "ChannelIndex",
        KeySchema: [
            {
                AttributeName: "channel",
                KeyType: "HASH"
            },
            {
                AttributeName: "name",
                KeyType: "RANGE"
            }
        ],
        Projection: {
            ProjectionType: "ALL"
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    }]
};

var file_system_table_params = {
    TableName: "files",
    KeySchema: [
        { AttributeName: "channel_name", KeyType: "HASH" },  //Partition key
        { AttributeName: "category_name", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "channel_name", AttributeType: "S" },
        { AttributeName: "category_name", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(file_system_table_params, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});