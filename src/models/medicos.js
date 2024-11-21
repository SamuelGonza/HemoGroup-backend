import {Schema, model} from 'mongoose'


const MedicosSchema = new Schema({
    nombre: {type: String, require: true},
    profesion: {type: String, require: true},
    picture: {
        public_id: {type: String, default: ""},
        url: {type: String, default: ""}
    },
    created: {type: Date, default: new Date()},
})

export const MedicosModel = model("medico", MedicosSchema)