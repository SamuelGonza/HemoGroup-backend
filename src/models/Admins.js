import {Schema, model} from 'mongoose';


const AdminsSchema = new Schema({
    name: {type: String, require: true, default: ""},
    correo: {type: String, require: true, unique: true},
    password: {type: String, require: true, default: ""},
})

export const AdminsModel = model("admin", AdminsSchema)