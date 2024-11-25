import {Router} from 'express'
import { adminLogin, createNewAdmin, getPQRSCStats } from '../controllers/Admins.controller.js';
import { AdminAuth } from '../auth/Admin.auth.js';


const router = Router()


router.post("/v1/admin/login", adminLogin)
router.post("/v1/admin/create", AdminAuth, createNewAdmin)

router.get("/v1/stats/pqrsc", AdminAuth, getPQRSCStats)

export default router;