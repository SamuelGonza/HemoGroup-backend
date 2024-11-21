import { Router } from "express";

import multer from "multer";
import { createNewMedico, getAllMedicos, getMedicoById } from "../controllers/Medicos.controller.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();



router.post("/v1/medicos", upload.single("image"), createNewMedico)
router.get("/v1/medicos/get", getAllMedicos)
router.get("/v1/medico/:idMedico", getMedicoById)


export default router