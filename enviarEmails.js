const sendMail = require('./envio')

const enviar = async () =>{
    console.log(await sendMail());
}

enviar()