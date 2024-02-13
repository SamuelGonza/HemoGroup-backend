import app from "./app.js";

const puerto = process.env.PORT || 3000;

app.listen(puerto,() => {
    console.log(`✅ El servidor ha encendido sin problema en el puerto ${puerto}, Excelente!`)
});