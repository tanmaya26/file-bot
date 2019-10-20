var AWS = require("aws-sdk");
var creds = new AWS.Credentials('ASIA23XI3UCH3AZWRDU6', 
'3kuMLgCCdLUnk6zAs4B0tr+Ialexq6WJ+VRWaM7Z', 
'FQoGZXIvYXdzEM7//////////wEaDI9Eb2jLh1eSPlFEoSL/ARkltvUGT3mHLxqIcS/v9uC39Ue4vR3fuQbpnznIFHT31mRAG1wqzD5lynAp9ILjkaiQzwTLvZCgAMW7ntU9S462lGavYgiYCZUnl6Z5nAK7cDm9fgL0Ne8EPywjVeva7JR91Tp6EsM2EBMb21dsPI6jalHAjm3SI35K89bNCKAO3mTu5AhDGJ4uKXuy/YqoN8nXStRk8YJ7u31jRO4BoxUnMcGo5dIqBfA5tDhpks3XWGNKEOjNV8UUIOSkp4UdcAHmEwQNiUzwmPRzXMOo1EpXVme1bua+Z/jdo6AZXmfrQ51i66ye1YCLooTAN0eD3EG3SrBVpJJ5DSYe/kQpyCi+1K/tBQ==');
AWS.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com",
  credentials : creds
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "watermark",
    KeySchema: [       
        { AttributeName: "name", KeyType: "HASH"},  //Partition key
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

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});