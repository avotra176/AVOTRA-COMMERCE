import  express  from "express";
import produitsRoutes from "./routes/produit.routes";
import venteRoute from "./routes/ventes.routes";
import categorieRoutes from "./routes/categorie.routes";
import authRoutes from "./routes/auth.routes";
import depenseRoute from "./routes/depense.routes";
import fournisseurRoutes from "./routes/fournisseur.routes";
import achatsRoute from "./routes/achat.routes";
import { pool } from "./config/database";

const app = express();

app.use(express.json());

app.get("/", (req,res)=> {
    res.send("Bienvenue sud l ' API AVOTRA COMMERCE ");
});

// Routes d'authentification
app.use("/auth", authRoutes);

// Routes produits
app.use("/produits", produitsRoutes);

// Routes produits
app.use("/achats", achatsRoute);

// Routes Ventes 
app.use("/ventes", venteRoute);

// Routes categories 
app.use("/categories", categorieRoutes);

// Routes depenese
app.use("/depenses", depenseRoute);

// Routes fournisseurs
app.use("/fournisseurs", fournisseurRoutes);


export default app;
