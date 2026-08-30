import dotenv from "dotenv";

dotenv.config();

import "./config/database";
import app from "./app";


const Port = process.env.PORT || 3000;

app.listen(Port, ()=> {
    console.log(`Serveur demare sur http://localhost: ${Port}`);
});