var aws = require('aws-sdk');

 async function getEmails(){
  const dynamo = new aws.DynamoDB({region: 'us-east-1'});
  const params    = `select email from `;
  const { Items } = await dynamo.executeStatement({Statement: params}).promise();
  const promise   = new Promise((resolv,reject) => {
    try {
      if(Items.length > 0){
            resolv({ code: 200, status: false, message: Items });
          }else{
            reject({ code: 400, status: true, message: ''})
          } 
      } catch (e) {
          console.log(e)
          reject({ code: 500, message: e.message })
      }
  });
  return promise;
}

async function getConfigs(){
  const dynamo    = new aws.DynamoDB({region: 'us-east-1'});
  const params    = `select noreply from Config where id='mkt'`;
  const { Items } = await dynamo.executeStatement({Statement: params}).promise();
  const promise   = new Promise((resolv,reject) => {
      try {
          if(Items.length > 0){
            resolv({ code: 200, status: false, message: Items });
           
          }else{
            reject({ code: 400, status: true, message: ''})
            
          } 
      } catch (e) {
          reject({ code: 500, message: e.message })
      }
  });

  return promise;
}

 async function listaCompletaEmails(){
  let listaCompletaEmails = []
  await getEmails()
    .then(e =>{
      for(c = 0; c < e.message.length; c++ ){
        listaCompletaEmails.push(e.message[c].email.S)
      }
    })
  return listaCompletaEmails
}

module.exports = { listaCompletaEmails, getConfigs };
