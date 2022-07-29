'use strict';

import AWS from 'aws-sdk';
const { DynamoDB } = AWS;
const dynamoDb = new DynamoDB.DocumentClient();
var db = new AWS.DynamoDB();

export const get = (event, context, callback) => {

  let ordernumber = event.rawPath.split('/')[1];

  console.error(ordernumber);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
     Ordernumber: ordernumber,
      
    },
  };

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    console.log(result);
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
      body: result.Item,
    };
    callback(null, response);
  });
};
