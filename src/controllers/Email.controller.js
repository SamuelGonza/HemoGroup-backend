import { transporter } from "../functions/nodemailer.js";
import fs from 'fs';
import path from 'path';

export const enviarCita = async (req, res) => {
    try {
        const { nombre, correo } = req.body;
        const archivos = req.files;

        console.log(nombre, correo, archivos)

        const plantillaHtml = `
            <!doctype html>
            <html lang="en-US">

            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Hemo Group Solicitud de cita.</title>
                <meta name="description" content="Hemo Group Solicitud de cita.">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>

            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
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
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Nueva cita solicitada</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                        El usuario ${nombre} con la dirección de correo electrónico ${correo} ha solicitado una cita y ha incluido archivos multimedia como anexo.
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
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
                const filePath = path.join(__dirname, 'temp', archivo.originalname);
                fs.writeFileSync(filePath, archivo.buffer);
                mailOptions.attachments.push({
                    filename: archivo.originalname,
                    path: filePath,
                });
                fs.unlinkSync(filePath);
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




