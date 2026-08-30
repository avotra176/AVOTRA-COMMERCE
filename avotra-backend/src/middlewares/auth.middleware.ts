import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const authMiddleware = (req: Request, res:Response,next: NextFunction)=>{
  try{
    // Recuperation de headers Autherization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Tokene manquant"
      });
    }
    // Verifier le format : Bearer token 
    if (!authHeader?.startsWith("Bearer ")){
      return res.status(401).json({
        success: false,
        message: "Format de token invalide",
      });
    }

    // Extraire seulement le token 
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token invalide"
      });
    }

    // Verifier le token 
    console.log("Token recu :", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Ajout l'utilisateur dans la requete
    (req as any).user = decoded;
    next();

  }
  catch (error: any) {
    console.error(error.name);
    console.error(error.message);
    return res.status(401).json({
      success: false,
      message: "Token expire ou invalide",
    });
  }
};

export default authMiddleware;



// // src/middlewares/auth.middleware.ts
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: "Token manquant" });
//   }

//   const [scheme, token] = authHeader.split(" ");
//   if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({ message: "Format du token invalide" });
//   }

//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     console.error("JWT_SECRET manquant dans l'environnement");
//     return res.status(500).json({ message: "Erreur de configuration du serveur" });
//   }

//   try {
//     const decoded = jwt.verify(token, secret);
//     (req as any).user = decoded;
//     next();
//   } catch (error) {
//     res.status(403).json({ message: "Token invalide" });
//   }
// };
