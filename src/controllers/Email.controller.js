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
        const { nombre, correo, telefono, mensaje } = req.body;
        const archivos = req.files;

        const plantillaHtml = `
            <!DOCTYPE html>
            <html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Hemo Group Solicitud de cita.</title>
                    <meta name="description" content="Hemo Group Solicitud de cita.">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <a href="https://hemogroup.netlify.app/" title="logo" target="_blank">
                                                <img width="60" src="../assets/Hemogroup.png" title="logo" alt="Hemo Group Logo">
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Nueva cita solicitada</h1>
                                                        <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                            El usuario ${nombre} con la dirección de correo electrónico ${correo} y telefono ${telefono} ha solicitado una cita y ha incluido archivos multimedia como anexo.
                                                        </p>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin-top:20px;">
                                                            ${mensaje}
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>https://hemogroup.netlify.app</strong></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>
            </html>
        `;

        const mailOptions = {
            from: "no-reply@hemogroup.com",
            to: correo,
            subject: "Notificación de Cita",
            html: plantillaHtml,
            attachments: [],
        };

        if (archivos && archivos.length > 0) {
            for (const archivo of archivos) {
                mailOptions.attachments.push({
                    filename: archivo.originalname,
                    content: archivo.buffer,
                    encoding: 'base64',
                });
            }
        }

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

        console.log(req.body)

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

        const users = [{correo: email, rol: "client"}, {correo: "samvasgoo@gmail.com", rol: "soporte"}]

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
        const { state, n_radicado, message } = req.body;

        const findPQRSC = await PQRSModel.findOneAndUpdate({ n_radicado }, { state }, { new: true }).lean();

        if (!findPQRSC) res.status(404).json({ message: "El pqrsc no existe" });


        await sendPQRSCUpdate({ client: {nombre: findPQRSC?.nombre, correo: findPQRSC?.correo}, pqrsc: findPQRSC, message});

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