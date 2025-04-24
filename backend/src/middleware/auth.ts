import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    // Leemos el token del header de la peticion
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('No autorizado');
        res.status(401).json({error: error.message})
        return 
    }

    const token = bearer.split(' ')[1];

    // Si no existe el token, devolvemos un error 401 (no autorizado)
    if (!token) {
        const error = new Error('No autorizado');
        res.status(401).json({error: error.message})
        return 
    }
    
    // Si el token es valido, buscamos el usuario en la base de datos
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);
         if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password');
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({error: error.message})
                return 
            }
            req.user = user;
            next()
         }
    } catch (error) {
        res.status(500).json({error: 'Token no valido'})
        
    }
}