import { MedicosModel } from "../models/medicos.js"
import { uploadCloudinaryImage } from "../utils/Cloudinary.js"


export const createNewMedico = async (req, res) => {
    try {
        const {nombre, profesion} = req.body
        

        let image = {
            public_id: "",
            url: ""
        }

        if(req.file) {
            const result = await uploadCloudinaryImage(req.file)

            if(result){
                image = {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            }
        }


        const newMedico = new MedicosModel({
            nombre,
            profesion,
            picture: image,
            created: new Date()
        })

        await newMedico.save()


        res.json({message: "Medico creado correctamente"})

    } catch (err) {
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getAllMedicos = async (req, res) => {
    try {
        const findAllMedicos = await MedicosModel.find().lean()
        
        if(findAllMedicos.length === 0){
            res.status(404).json({message: "Aun no hay medicos"})
            return;
        }

        res.json({message: "Correcto", data: [...findAllMedicos]})

    } catch (err) {
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getMedicoById = async (req, res) => {
    try {
        const {idMedico} = req.params;

        const findMedico = await MedicosModel.findById(idMedico).lean()
        
        if(!findMedico){
            res.status(404).json({message: "Este medico no existe"})
            return;
        }

        res.json({message: "Correcto", data: {...findMedico}})

    } catch (err) {
        res.status(500).json({ message: "Error del servidor" });
    }
}