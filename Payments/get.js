'use strict';

import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js';
const { DynamoDB } = AWS;
const dynamoDb = new DynamoDB.DocumentClient();
export const get = (event, context, callback) => 
 {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      Userid: event.pathParameters.Userid,
      
    },
  };

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
