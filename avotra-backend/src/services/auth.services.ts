import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";
import { CreateUtilisateur, Utilisateur } from "../types/utilisateur.types";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans l'environnement");
}

export type AuthResult = {
  token: string;
  user: Omit<Utilisateur, "mot_de_passe">;
};

export const AuthService = {
  // register service 
  async register(data: CreateUtilisateur) {
    const { nom, prenom, email, mot_de_passe, telephone, role } = data;

    if (!email || !mot_de_passe) {
      throw new Error("Email et mot de passe sont obligatoires");
    }

    const existing = await pool.query("SELECT id FROM utilisateurs WHERE email = $1", [email]);
    if ((existing.rowCount ?? 0) > 0) {
      throw new Error("Cet email est déjà utilisé");
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, role, actif)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nom, prenom, email, hashedPassword, telephone, role, true]
    );

    const user = result.rows[0] as Utilisateur;
    const { mot_de_passe: _, ...userSafe } = user;
    return userSafe;
  },

  // Login service 
  async login(email: string, mot_de_passe: string): Promise<AuthResult> {
    if (!email || !mot_de_passe) {
      throw new Error("Email et mot de passe sont obligatoires");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query(
      "SELECT * FROM utilisateurs WHERE LOWER(email) = LOWER($1)",
      [normalizedEmail]
    );
    const user = result.rows[0] as Utilisateur | undefined;
    if (!user) {
      throw new Error("Email incorrect");
    }

    let isValidPassword = false;

    if (user.mot_de_passe.startsWith("$2")) {
      isValidPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    } else {
      isValidPassword = user.mot_de_passe === mot_de_passe;
      if (isValidPassword) {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        await pool.query("UPDATE utilisateurs SET mot_de_passe = $1 WHERE id = $2", [hashedPassword, user.id]);
      }
    }

    if (!isValidPassword) {
      throw new Error("Mot de passe incorrect");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const { mot_de_passe: _, ...userSafe } = user;
    return { token, user: userSafe };
  },
  // Changer le mot de passe (utilisateur connecté)
  async changePassword(userId: number, ancienMotDePasse: string, nouveauMotDePasse: string) {
    if (!ancienMotDePasse || !nouveauMotDePasse) {
      throw new Error("L'ancien et le nouveau mot de passe sont obligatoires");
    }

    if (nouveauMotDePasse.length < 6) {
      throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères");
    }

    const result = await pool.query("SELECT * FROM utilisateurs WHERE id = $1", [userId]);
    const user = result.rows[0] as Utilisateur | undefined;

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const isValidPassword = await bcrypt.compare(ancienMotDePasse, user.mot_de_passe);
    if (!isValidPassword) {
      throw new Error("Ancien mot de passe incorrect");
    }

    const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);
    await pool.query("UPDATE utilisateurs SET mot_de_passe = $1 WHERE id = $2", [hashedPassword, userId]);
  },
};
