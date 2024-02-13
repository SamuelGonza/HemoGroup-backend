import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import EmailRoute from './routes/Emails.routes.js'

const app = express();

const cosrOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "https:/hemogroup.netlify.app"],
    optionsSuccessStatus: 200
}

app.use(cors(cosrOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(EmailRoute)

export default app;