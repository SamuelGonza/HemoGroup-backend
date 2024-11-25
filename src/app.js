import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import EmailRoute from './routes/Emails.routes.js'
import MedicosRoutes from './routes/Medicos.routes.js'
import AdminsRoutes from './routes/Admins.routes.js'

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "https:/hemogroup.netlify.app"],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.get("/", (req, res) => {
    res.json({
        name: "HEMOGROUP BACKEND",
        version: "1.0.0",
        access: "private",
        ok: true
    })
})

app.use(EmailRoute)
app.use(MedicosRoutes)
app.use(AdminsRoutes)

app.all("*", (req, res) => {
    res.status(404).json({ message: "This path doesn't exist" });
});

export default app;