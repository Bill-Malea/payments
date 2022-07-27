'use strict';
  
import AWS from 'aws-sdk';
const { DynamoDB } = AWS;
const dynamoDb = new DynamoDB.DocumentClient();


export const create  = (event, context, callback) => {

  const responseData = event.body;
 
  let  data = JSON.parse(responseData);

let responseBody = data.Body.stkCallback;
   let resPCODE = responseBody.ResultCode;
   console.log(resPCODE);
 let paymentdetails = responseBody.CallbackMetadata.Item;
 console.log(paymentdetails);


 
  if( resPCODE == 0 ){
 
    var mpesatransactioncode;
    var phonenumber;
   var amountpaid;

    paymentdetails.forEach(element => {
    switch (element.Name){
       case 'MpesaReceiptNumber':
          mpesatransactioncode = element.Value
          break;
          case 'Amount':
           amountpaid = element.Value
            break;
            case 'PhoneNumber':
              phonenumber  = element.Value
             break;

      }
      
   });

 let  Usertransactionpayload = {
    
   Ordernumber : mpesatransactioncode,
   Amount: amountpaid,
   Phonenumber:phonenumber,
    paymentstatus : true

   }
 
   console.log(Usertransactionpayload)


 let userid = event.pathParameters.Userid;


 //console.log(userid);


    const params = {
    TableName: process.env.DYNAMODB_TABLE,
    
    Item: {
    Userid : userid,
    Orders   : {
    ordernumber : Usertransactionpayload
     }
      
    },
     
    
   
  };


 
 dynamoDb.put(params, (error) => { 
 // handle potential errors
if (error) {
 console.error(error);
 callback(null, {
     statusCode: error.statusCode || 501,
     headers: { 'Content-Type': 'text/plain' },
     body: 'Couldn\'t create payment details.',
   });
    return;
  }

 
 //create a response
  const response = {
    statusCode: 200,
    body: JSON.stringify('sucessful'),
  };
  callback(null, response);
});











  


 }
  
  // if (typeof data.text !== 'string') {

  //   console.error('Validation Failed');
  //   callback(null, {
  //     statusCode: 400,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: 'Couldn\'t create the todo item.',
  //   });
  //   return;
  // }

  

 
}
