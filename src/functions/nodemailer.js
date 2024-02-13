import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "mailgun",
    auth: {
        user: process.env.MAILGUN_USER,
        port: process.env.MAILGUN_PORT,
        pass: process.env.MAILGUN_PASS,
    },
});
