'use strict';
var aws = require('aws-sdk');
const { listaCompletaEmails, getConfigs }  = require('./utils')

async function sendMail(){
  let count           = 0;
  let emailsParaEnvio = [];
  let result          = [];
  let totalenviado    = 0;
  let totalSend       = 0;

  await listaCompletaEmails().then(async (e) =>{
    
    for (let c = 0; c < e.length; c++){
      count ++
      emailsParaEnvio.push(e[c]);

      if (count == 50 || e.length - totalenviado < 50) {
        result.push(await enviarEmail(emailsParaEnvio));
        emailsParaEnvio = []
        count = 0
        totalenviado = totalenviado + 50;
        totalSend    += 50;
        console.log(totalSend);
      }

    }
  });

  return result;
};

async function enviarEmail(emailsParaEnvio){
    aws.config.loadFromPath('./config.json');                        
    const ses          = new aws.SES();
    const subject      = "Titulo do e-mail";
    const { message }  = await getConfigs();
    const base64ToName = Buffer.from(subject).toString('base64');
    const nameAddress  = `=?UTF-8?B?${base64ToName}?= <${message[0].noreply.S}>`;
    const charset      = "UTF-8";
    const body_html = `html do e-mail`;
    
    var params = { 
      Source: nameAddress,
      Destination: {
        BccAddresses: emailsParaEnvio 
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: charset
        },
        Body: {
          Html: {
            Data: body_html,
            Charset: charset
          }
        }
      },
    };
    return await ses.sendEmail(params).promise();
}

module.exports = sendMail;