import { Router } from "express";
import { enviarCita, enviarPqrs, getAllPrqs, getPqrscById, sendContactoEmail, sendPQRSCState } from "../controllers/Email.controller.js";

import multer from "multer";
import { AdminAuth } from "../auth/Admin.auth.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export const uploadDocuments = multer({storage}).single("documents");

const router = Router();


router.post("/v1/citas/send", upload.array("archivos", 3), enviarCita);


router.get("/v1/pqr/:radicado", getPqrscById)
router.post("/v1/pqrs/send", uploadDocuments, enviarPqrs);
router.post("/v1/contacto/send", sendContactoEmail)


router.get("/v1/pqrs/get", AdminAuth, getAllPrqs)
router.put("/v1/pqrsc", AdminAuth, sendPQRSCState)


export default router;