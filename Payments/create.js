'use strict';
  
import AWS from 'aws-sdk';
const { DynamoDB } = AWS;
const dynamoDb = new DynamoDB.DocumentClient();


export const create  = (event, context, callback) => {
 
 
  let userid = event.rawPath.split('/')[1];
  let ordernumber = event.rawPath.split('/')[2];

  let  data = JSON.parse(event.body);

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

 let  Usertransactionpayload = 
 {   
      Amount: amountpaid,
      Phonenumber:phonenumber,
       paymentstatus : true,
   }

    const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
    Userid:userid,
    Ordernumber: ordernumber,
    Order   : Usertransactionpayload
    
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











  


 }else{

  const response = {
    statusCode: 400,
    body: JSON.stringify('An Error Occured'),
  };







  callback(null, response);



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
