import { AdminsModel } from "../models/Admins.js";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import PQRSModel from "../models/pqrs.js";
dotenv.config();

const TOKEN_SECRET = process.env.JWT_SECRET;


export const adminLogin = async (req, res) => {
    try {
        const {correo, password} = req.body;
        
        const findUser = await AdminsModel.findOne({correo}).lean()


        if(findUser){
            const verifyPassword = bcrypt.compare(password, findUser.password)

            if(verifyPassword){

                const data = {
                    _id: findUser._id,
                    rol: "Admin",
                }

                const token = jwt.sign(data, TOKEN_SECRET, {
                    expiresIn: "30d"
                })

                res.json({message: "Correcto", data: {accessToken: token}})
                return;

            }else{
                res.status(401).json({message: "Contraseña incorrecta"})
                return;
            }
        }else{
            res.status(401).json({message: "Esta cuenta no existe"})
            return;
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error en el servidor", err });
    }
}

export const createNewAdmin = async (req, res) => {
    try {
        const {name, correo, password} = req.body;


        const verifyCorreo = await AdminsModel.findOne({correo}).lean()

        if(verifyCorreo){
            res.status(409).json({message: "Ya hay una cuenta asociada a este correo"})
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = new AdminsModel({
            name,
            correo,
            password: hashedPassword
        })

        await newAdmin.save()

        res.json({message: "Admin creado correctamente"})

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error en el servidor", err });
    }
}





// ESTADISTICAS

export const getPQRSCStats = async (req, res) => {
    try {
        const getPQRSC = await PQRSModel.find().lean();

        const data = getPQRSC.reduce(
            (acc, instalacion) => {
                switch (instalacion.state) {
                    case "Recibida":
                        acc.recibidas++;
                        break;
                    case "En revisión":
                        acc.enRevision++;
                        break;
                    
                    case "Completada":
                        acc.completadas++;
                        break;
                    default:
                        break;
                }
                return acc;
            },
            { recibidas: 0, enRevision: 0, completadas: 0,}
        );

        res.json({ message: "Correcto", data });

    } catch (err) {
        res.status(err.code || 500).json({
            message: err.message,
            code: err.code
        });
    }
};
