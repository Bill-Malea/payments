'use strict';
import AWS from 'aws-sdk';
const { DynamoDB } = AWS;
const dynamoDb = new DynamoDB.DocumentClient();


export const list = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Userid :event.rawPath.split('/')[1]
    
  };

  // fetch all todos from the database
  dynamoDb.scan(params,(error, result) => {
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
