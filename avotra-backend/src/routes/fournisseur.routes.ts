import { Router } from 'express';
import  authMiddleware  from '../middlewares/auth.middleware';
import { createfournisseur, getfournisseur, getfournisseurById, updatefournisseur, deletefournisseur } from '../controllers/fournisseur.controllers';


const router = Router();

router.post("/", authMiddleware, createfournisseur);
router.get("/",  authMiddleware, getfournisseur);
router.get("/:id", authMiddleware, getfournisseurById);
router.put("/:id", authMiddleware, updatefournisseur);
router.delete("/:id", authMiddleware, deletefournisseur);

export default router;