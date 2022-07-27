'use strict';


import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js';
const { DynamoDB } = AWS;
const dynamoDb = new DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};
//module.exports.list = (event, context, callback) 
export const list = (event, context, callback) => {
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
