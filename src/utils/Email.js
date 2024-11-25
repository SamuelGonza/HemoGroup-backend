import { transporter } from "../functions/nodemailer.js";

export const sendPQRSCUpdate = async ({client, pqrsc, message, onlyMessage = false}) => {
    try {
    
        const plantillaHtml = `
        
           
           
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.cdnfonts.com/css/megabyte');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Megabyte', sans-serif !important;
        }
        
        body{
            background-color: gainsboro;
        }
        
        .email-wrapper{
            max-width: 800px;
            width: 100%;
            background-color: white;
            margin: auto;
            padding: 12px;
        }
      
        .logo{
          width: 140px;
          height: 140px;
          margin: auto;
        }
      
        .logo img{
          width: 140px;
          height: 140px;
          object-fit: contain;
        }
      
        .big-title{
          width: 100%;
          text-align: center;
        }
      
        .subtitle{
          text-align: center;
          margin: 10px 0;
        }
      
        .client-message{
          width: 80%;
          margin: auto;
          background-color: #74cfe2;
          padding: 10px;
          border-radius: 16px;
          color: white;
        }
      
        footer{
          width: 100%;
          text-align: center;
          margin-top: 40px;
          border-top: 1px solid gainsboro;
          padding: 20px 0;
        }
      
        .document{
          margin-top: 40px;
          padding: 20px;
          border: 3px dashed black;
        }
      
        .client-info{
          width: 80%;
          margin: 20px auto;
        }
      
        .client-info p {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
            margin-bottom: 10px;
        }

        .client-info p span {
            font-weight: bold;
            color: #74cfe2;
        }
      
      .states-container{
        width: 100%;
        margin-top: 60px;
      }
      
      .recibida{
        display: inline-block;
        width: 32%;
        min-height: 30px;
        background-color: gray;
        text-align: center;
        color: white;
      }
      
      .en-revision{
        display: inline-block;
        width: 32%;
        min-height: 30px;
        background-color: orange;
        text-align: center;
        color: white;
      }
      
      .completada{
        display: inline-block;
        width: 32%;
        min-height: 30px;
        background-color: green;
        text-align: center;
        color: white;
      }
      
      .state-big{
        min-height: 70px !important;
        
      }
      
      
        @media (max-width: 600px) {
            .client-info h1 {
                font-size: 24px;
            }
            .client-info p {
                font-size: 14px;
            }
        } /* Cierre de media query */
      
    </style>
    <title>${onlyMessage ? "Haz recibido un mensaje sobre tu PQRS": "Ha cambiado el estado de tu PQRSC"}</title>
</head>
<body>
  <div class="email-wrapper">
    <div class="logo">
        <img src="https://res.cloudinary.com/appsftw/image/upload/v1731703788/correos%20assets/uk0ltklutkwyikzuglfb.png"/>
    </div>
    
    <h1 class="big-title">${onlyMessage ? "Haz recibido un mensaje sobre tu PQRS": "El estado de tu PQRSC ha cambiado"}</h1>
    <h2 class="big-title">Número de radicado: ${pqrsc.n_radicado}</h2>
    
    <p class="subtitle">Hola, ${client.nombre}, nos hemos enterado de tu PQRSC y el su estado ha cambiado</p>
    
    <div class="client-info">
        <p><span>Tipo de PQRS:</span> ${pqrsc.pqrsType}</p>
      <p><span>Mensaje que enviaste:</span> ${pqrsc.mensaje}</p>
    </div>

    <div class="client-message">
      <h2 class="big-title">Mensaje de respuesta</h2>
      ${message}
    </div>
    
    <h3 class="big-title">Estado de tu PQRSC</h3>
    
    <div class="states-container">
      
    <div class="recibida ${pqrsc.state === 'Recibida' ? 'state-big' : ''}">Recibida</div>
    <div class="en-revision ${pqrsc.state === 'En revisión' ? 'state-big' : ''}">En revisión</div>
    <div class="completada ${pqrsc.state === 'Completada' ? 'state-big' : ''}">Completada</div>
    </div>

    
    <footer>
        HemoGroup 
 2024 -  Todos los derechos reservados a marca y empresa
    </footer>
  </div>
</body>
</html>

        `

        const mailOptions = {
            from: `"${onlyMessage ? "Mensaje de respuesta de PQRS - Hemo Group": "El estado de tu PQRS ha cambiado"}" <no-reply@tecnotics.co>`,
            to: `${client.correo}`,
            subject: `El estado de tu PQRSC ha cambiado, te daremos respuesta lo mas pronto posible`,
            html: plantillaHtml,
        };
    
        await transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error('Error al enviar el correo:', err);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });
    } catch (err) {
        console.log(err);
        return { ok: false }; 
    }
}

export const sendContacto = async (client) => {
  try {
    
    const plantillaHtml = `
      
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.cdnfonts.com/css/megabyte');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Megabyte', sans-serif !important;
        }
        
        body{
            background-color: gainsboro;
        }
        
        .email-wrapper{
            max-width: 800px;
            width: 100%;
            background-color: white;
            margin: auto;
            padding: 12px;
        }
      
        .logo{
          width: 140px;
          height: 140px;
          margin: auto;
        }
      
        .logo img{
          width: 140px;
          height: 140px;
          object-fit: contain;
        }
      
        .big-title{
          width: 100%;
          text-align: center;
        }
      
        .subtitle{
          text-align: center;
          margin: 10px 0;
        }
      
        .client-message{
          width: 80%;
          margin: auto;
          background-color: #74cfe2;
          padding: 10px;
          border-radius: 16px;
          color: white;
        }
      
        footer{
          width: 100%;
          text-align: center;
          margin-top: 40px;
          border-top: 1px solid gainsboro;
          padding: 20px 0;
        }
      
        .document{
          margin-top: 40px;
          padding: 20px;
          border: 3px dashed black;
        }
      
        .client-info{
          width: 80%;
          margin: 20px auto;
        }
      
        .client-info p {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
            margin-bottom: 10px;
        }

        .client-info p span {
            font-weight: bold;
            color: #74cfe2;
        }
      
      .states-container{
        width: 100%;
        margin-top: 60px;
      }
      
      .recibida{
        display: inline-block;
        width: 32%;
        min-height: 30px;
        background-color: gray;
        text-align: center;
        color: white;
      }
      
      .en-revision{
        display: inline-block;
        width: 32%;
        min-height: 30px;
        background-color: orange;
        text-align: center;
        color: white;
      }
      
      .completada{
        display: inline-block;
        width: 32%;
        min-height: 30px;
        background-color: green;
        text-align: center;
        color: white;
      }
      
      .state-big{
        min-height: 70px !important;
        
      }
      
      
        @media (max-width: 600px) {
            .client-info h1 {
                font-size: 24px;
            }
            .client-info p {
                font-size: 14px;
            }
        } /* Cierre de media query */
      
    </style>
    <title>El cliente ${client.nombre} ha enviado un mensaje de contacto</title>
</head>
<body>
  <div class="email-wrapper">
    <div class="logo">
        <img src="https://res.cloudinary.com/appsftw/image/upload/v1731703788/correos%20assets/uk0ltklutkwyikzuglfb.png"/>
    </div>
    
    <h1 class="big-title">El cliente ${client.nombre} ha enviado un mensaje de contacto</h1>
   
   
    
    <div class="client-info">
        <p><span>Nombre:</span> ${client.nombre}</p>
      <p><span>Correo:</span> ${client.correo}</p>
      <p><span>Telefono:</span> ${client.telefono}</p>
    </div>

    <div class="client-message">
      <h2 class="big-title">Mensaje del cliente</h2>
      ${client.message}
    </div>
    
  
    
    <footer>
        HemoGroup 
 2024 -  Todos los derechos reservados a marca y empresa
    </footer>
  </div>
</body>
</html>
    `

    const mailOptions = {
      from: `"Nuevo mensaje de contacto" <no-reply@tecnotics.co>`,
      to: `calidad@hemogroup.com.co`,
      subject: `El cliente ${client.nombre} ha enviado un mensaje de contacto.`,
      html: plantillaHtml,
  };

  await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
          console.error('Error al enviar el correo:', err);
      } else {
          console.log('Correo enviado:', info.response);
      }
  });

  } catch (err) {
    
  }
}