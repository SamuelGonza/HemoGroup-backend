import { Router } from "express";
import { enviarCita, enviarPqrs, getAllPrqs, getPqrscById, sendPQRSCState } from "../controllers/Email.controller.js";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();


router.post("/v1/citas/send", upload.array("archivos", 3), enviarCita);


router.post("/v1/pqrs/send", upload.single("archivos"), enviarPqrs);
router.get("/v1/pqrs/:radicado", getPqrscById)
router.get("/v1/pqrs/get", getAllPrqs)
router.put("/v1/pqrsc", sendPQRSCState)

export default router;