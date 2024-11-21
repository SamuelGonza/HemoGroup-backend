import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const db = mongoose.connection;

export const conectarDb = async () => {
    try {
        const mongoUri = process.env.URI_MONGO_CONEXION
        if(!mongoUri) {
            console.log(`La variable de entorno no esta definida`)
            process.exit(1)
        }

        mongoose.connect(mongoUri, {dbName: "hemo-group"})
            .catch((err) => {
                throw new Error(`❌ No se conecto a la db, revisate las credenciales, ${err}`)
            });

        db.on("open", () => {
            console.log("🚀💯 La base de datos ha sido conectada ")
        });

    } catch (err) {
        console.log(`❌ Hubo un error con la base de datos: ${err}`)
    }
}

conectarDb()