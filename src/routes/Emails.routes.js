import { Router } from "express";
import { enviarCita } from "../controllers/Email.controller.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();


router.post("/citas/send", upload.array("archivos", 3), enviarCita);

export default router;