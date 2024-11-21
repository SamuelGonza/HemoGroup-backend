import {model, Schema} from 'mongoose';

const PQRS = new Schema({
    nombre: {type: String, require: true}, 
    cedula: {type: Number, require: true}, 
    correo: {type: String, require: true}, 
    celular: {type: Number, require: true}, 
    pqrsType: {type: String, require: true, default: "pregunta"}, 
    mensaje: {type: String, require: true}, 
    document: {
        public_id: {type: String, default: ""},
        url: {type: String, default: ""}
    },
    state: {type: String, default: "Recibida"},
    created: {type: Date, default: new Date()},
    n_radicado: {type: Number, default: 11111, unique: true}
});

const PQRSModel = model("pqrsc", PQRS)

export default PQRSModel;