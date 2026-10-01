import type {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {prisma} from "../lib/prisma.js";

interface JwtPayload {
    userId: number;
}

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;
    
    if(!authorization) {
        return res.status(401).json({
            message: "Token não informado"
        });
    }

    const [type, token] = authorization.split(" ")

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Token inválido"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                role: true,
                status: true
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Usuário não encontrado"
            });
        }

        if(user.status === "BLOCKED"){
            return res.status(403).json({
                message: "Usuário bloqueado"
            });
        }

        req.user = {
            userId: user.id,
            role: user.role
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Token inválido ou expirado"
        });
    }
}