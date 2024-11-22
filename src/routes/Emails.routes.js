import { Router } from "express";
import { enviarCita, enviarPqrs, getAllPrqs, getPqrscById, sendContactoEmail, sendPQRSCState } from "../controllers/Email.controller.js";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export const uploadDocuments = multer({storage}).single("documents");

const router = Router();


router.post("/v1/citas/send", upload.array("archivos", 3), enviarCita);


router.post("/v1/pqrs/send", uploadDocuments, enviarPqrs);
router.get("/v1/pqrs/:radicado", getPqrscById)
router.get("/v1/pqrs/get", getAllPrqs)
router.put("/v1/pqrsc", sendPQRSCState)

router.post("/v1/contacto/send", sendContactoEmail)

export default router;