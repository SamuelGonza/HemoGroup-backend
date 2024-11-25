import { transporter } from "../functions/nodemailer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import PQRSModel from "../models/pqrs.js";
import { generarNumeroRadicado } from "../utils/generateCodes.js";
import { uploadCloudinaryFile } from "../utils/Cloudinary.js";
import { sendContacto, sendPQRSCUpdate } from "../utils/Email.js";

// Obtén la ruta del directorio del módulo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const enviarCita = async (req, res) => {
    try {
        const { nombre, correo, telefono, mensaje, eps } = req.body;
        const archivos = req.files;

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
    <title>NUEVA SOLICITUD DE CITA</title>
</head>
<body>
  <div class="email-wrapper">
    <div class="logo">
        <img src="https://res.cloudinary.com/appsftw/image/upload/v1731703788/correos%20assets/uk0ltklutkwyikzuglfb.png"/>
    </div>
    
    <h1 class="big-title">Nueva solicitud de cita del cliente ${nombre}</h1>
   
   
    
    <div class="client-info">
        <p><span>Nombre:</span> ${nombre}</p>
      <p><span>Correo:</span> ${correo}</p>
      <p><span>Telefono:</span> ${telefono}</p>
       <p><span>EPS:</span> ${eps}</p>
    </div>

    <div class="client-message">
      <h2 class="big-title">Mensaje del cliente</h2>
      ${mensaje}
    </div>
    
     <div class="document">
      Archivos enviados: ${archivos && archivos.length > 0 ? `${archivos.length} archivos`: "No se envió ningún archivo"}
    </div>
    
  
    
    <footer>
        HemoGroup 
 2024 -  Todos los derechos reservados a marca y empresa
    </footer>
  </div>
</body>
</html>
        `;

        const archivosMap = archivos.map((archivo) => {
            return {
                filename: archivo.originalname,
                content: archivo.buffer,
            }
        })

        const mailOptions = {
            from: "no-reply@hemogroup.com",
            to: "gestor1@hemogroup.com.co",
            subject: `Nueva solicitud de Cita del cliente ${nombre}`,
            html: plantillaHtml,
            attachments: archivosMap.length > 0 ? archivosMap: [],
        };

        await transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error(err);
                res.status(500).send({
                    error: "Error al enviar el correo electrónico",
                });
            } else {
                res.status(200).send({
                    message: "Correo electrónico enviado exitosamente",
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error en el servidor" });
    }
};
export const enviarPqrs = async (req, res) => {
    try {
        const { fullName, cedula, email, phone, pqrsType, description, isAnonymous} = req.body;
        const archivos = req.file;

        const isAnonymousParsed = isAnonymous === 'true' ? true: isAnonymous === 'false' && false

        let image = {
            public_id: "",
            url: ""
        }

        if(archivos){
            const result = await uploadCloudinaryFile(archivos)

            if(result){
                image = {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            }

        }

        const newPqrs = new PQRSModel({
            nombre: isAnonymousParsed ? "anonimo" :fullName,
            cedula: isAnonymousParsed ? 1000: cedula,
            correo: isAnonymousParsed ? "anonimo" :email,
            celular: isAnonymousParsed ? 1000: phone,
            pqrsType,
            mensaje: description,
            document: image,
            state: "Recibida",
            n_radicado: generarNumeroRadicado(),
            created: new Date()
        })

        await newPqrs.save()


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
      
        @media (max-width: 600px) {
            .client-info h1 {
                font-size: 24px;
            }
            .client-info p {
                font-size: 14px;
            }
        } /* Cierre de media query */
      
    </style>
    <title>Nueva PQRS: ${newPqrs.pqrsType}</title>
</head>
<body>
  <div class="email-wrapper">
    <div class="logo">
        <img src="https://res.cloudinary.com/appsftw/image/upload/v1731703788/correos%20assets/uk0ltklutkwyikzuglfb.png"/>
    </div>
    
    <h1 class="big-title">Nueva PQRSC: ${newPqrs.pqrsType}</h1>
    <h2 class="big-title">Número de radicado: ${newPqrs.n_radicado}</h2>
    
    <p class="subtitle">Hola, ${newPqrs.nombre} has enviado un PQRSC del tipo ${newPqrs.pqrsType}</p>
    
    <div class="client-info">
        <p><span>Nombre Completo:</span> ${newPqrs.nombre}</p>
        <p><span>Cédula:</span> ${newPqrs.cedula}</p>
        <p><span>Correo:</span> ${newPqrs.correo}</p>
        <p><span>Teléfono:</span> ${newPqrs.celular}</p>
        <p><span>Tipo de PQRS:</span> ${newPqrs.pqrsType}</p>
    </div>
    
    <div class="client-message">
      <h2 class="big-title">Mensaje que enviaste</h2>
      ${newPqrs.mensaje}
    </div>
    
    <div class="document">
      Archivos enviados por ti: ${archivos && archivos.originalname || "No se envió ningún archivo"}
    </div>
    
    <footer>
        Hemo Group 
 2024 -  Todos los derechos reservados a marca y empresa
    </footer>
  </div>
</body>
</html>

        `

        const plantillaHtmlCliente = `
               
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
          background-color: #175d7f;
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
            color: #175d7f;
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
    <title>Nueva PQRS: ${newPqrs.pqrsType}</title>
</head>
<body>
  <div class="email-wrapper">
    <div class="logo">
        <img src="https://res.cloudinary.com/appsftw/image/upload/v1731689869/correos%20assets/hwtmmgvnwfkfrv6rgvmb.png"/>
    </div>
    
    <h1 class="big-title">Nueva PQRSC: ${newPqrs.pqrsType}</h1>
    <h2 class="big-title">Número de radicado: ${newPqrs.n_radicado}</h2>
    
    <p class="subtitle">Hola, ${newPqrs.nombre} has enviado un PQRSC del tipo ${newPqrs.pqrsType}</p>
    
    <div class="client-info">
        <p><span>Nombre Completo:</span> ${newPqrs.nombre}</p>
        <p><span>Cédula:</span> ${newPqrs.cedula}</p>
        <p><span>Correo:</span> ${newPqrs.correo}</p>
        <p><span>Teléfono:</span> ${newPqrs.celular}</p>
        <p><span>Tipo de PQRS:</span> ${newPqrs.pqrsType}</p>
    </div>
    
    <div class="client-message">
      <h2 class="big-title">Mensaje que enviaste</h2>
      ${newPqrs.mensaje}
    </div>
    
    <div class="document">
      Archivos enviados por ti: ${archivos && archivos.originalname || "No se envió ningún archivo"}
    </div>
    
    <footer>
        Vlips 
 2024 -  Todos los derechos reservados a marca y empresa
    </footer>
  </div>
</body>
</html>

        `

        const users = [{correo: email, rol: "client"}, {correo: "calidad@hemogroup.com.co", rol: "soporte"}]

        for(const user of users){
            const mailOptions = {
                from: `"Nueva PQRS de ${newPqrs.nombre}" <no-reply@hemogroup.com>`,
                to: `${user.correo}`,
                subject: user.rol === "soporte" ? `El cliente ${newPqrs.nombre} ha enviado una PQRSF`: `Hola ${newPqrs.nombre}, hemos recibido tu PQRSC`,
                html: user.rol === "soporte" ? plantillaHtml: plantillaHtmlCliente,
                attachments: archivos ? [
                    {
                        filename: archivos.originalname,
                        content: archivos.buffer,
                    }
                ]: [],
            };
    
            await transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    return err
                } else {
                    return;
                }
            });
        }

        res.status(200).send({
            message: "Correo electrónico enviado exitosamente",
        });

       
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error en el servidor" });
    }
};
export const getAllPrqs = async (req, res) => {
    try {
        const getPqrs = await PQRSModel.find().lean()

        if(getPqrs.length === 0){
            res.status(404).json({message: "No hay PQRS aún"})
            return;
        }

        res.json({message: "Correcto", data: [...getPqrs]})
    } catch (err) {
        res.status(500).json({message: "Error interno", err})
    }
}
export const getPqrscById = async (req, res) => {
    try {
        const {radicado} = req.params;
        const getPqrsc = await PQRSModel.findOne({n_radicado: radicado}).lean()

        if(!getPqrsc) res.status(404).json({message: "Este pqrsc no existe"})

        res.json({message: "Correcto", data: {...getPqrsc}})
    } catch (err) {
        res.status(500).json({ message: "Error del servidor" });
    }
}
export const sendPQRSCState = async (req, res) => {
    try {
        const { state, n_radicado, message, onlyMessage } = req.body;

        let findPqrs = {}

        if(onlyMessage){
            findPqrs = await PQRSModel.findOne({n_radicado}).lean()
        }else{
            findPqrs = await PQRSModel.findOneAndUpdate({ n_radicado }, { state }, { new: true }).lean();
        }

        if (!findPqrs) res.status(404).json({ message: "El pqrsc no existe" });


        await sendPQRSCUpdate({ client: {nombre: findPqrs?.nombre, correo: findPqrs?.correo}, pqrsc: findPqrs, message, onlyMessage});

        res.json({ message: "PQRS enviada con éxito" });
    } catch (err) {
        res.status(500).json({ message: "Error del servidor" });
    }
};
export const sendContactoEmail = async (req, res) => {
    try {
        const {nombre, correo, telefono, message} = req.body;

        const client = {
            nombre,
            correo,
            telefono,
            message
        }

        await sendContacto(client)

        res.json({message: "Se ha enviado correctamente el correo"})
    } catch (err) {
        res.status(500).json({message: "Error interno", err})
    }
}