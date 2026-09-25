import type {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number;
    role: "USER" | "ADMIN";
}

export function authMiddleware(
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

        req.user = decoded;

        next();
    } catch {
        return res.status(401).json({
            message: "Token inválido ou expirado"
        })
    }
}