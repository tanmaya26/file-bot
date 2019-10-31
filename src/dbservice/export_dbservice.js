var AWS = require("aws-sdk");

async function delete_file_record(file_id) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "files",
        Key:{
        "file_id": file_id
        }
    };
    return await new Promise((resolve, reject) => {
        docClient.delete(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Get Item succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        })
    });
}


module.exports.delete_file_record = delete_file_record;