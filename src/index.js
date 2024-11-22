import app from "./app.js";
import './database/db.js'

const puerto = process.env.PORT || 3001;

app.listen(puerto,() => {
    console.log(`✅ El servidor ha encendido sin problema en el puerto ${puerto}, Excelente!`)
});