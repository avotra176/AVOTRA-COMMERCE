import { Router } from 'express';
import  authMiddleware  from '../middlewares/auth.middleware';
import { createDepense, getDepense, getDepenseById, updateDepense,deleteDepense } from '../controllers/depense.controllers';


const router = Router();

router.post("/", authMiddleware, createDepense);
router.get("/", authMiddleware, getDepense);
router.get("/:id", authMiddleware, getDepenseById);
router.put("/:id", authMiddleware, updateDepense);
router.delete("/:id", authMiddleware, deleteDepense);

// router.post("/",  createDepense);
// router.get("/",  getDepense);
// router.get("/:id",  getDepenseById);
// router.put("/:id",  updateDepense);
// router.delete("/:id",  deleteDepense);

export default  router;