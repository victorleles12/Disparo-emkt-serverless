const sendMail = require('./envio')

exports.handler = async (event) =>{
   const teste = await sendMail();
   return teste;
}

