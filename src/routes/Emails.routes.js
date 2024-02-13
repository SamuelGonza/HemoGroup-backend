import { Router } from "express";
import { enviarCita } from "../controllers/Email.controller.js";
const router = Router();


router.post("/citas/send", enviarCita)

export default router;