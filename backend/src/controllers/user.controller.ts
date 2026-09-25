import type {Request, Response} from "express";
import {z} from "zod";
import {createUser} from "../services/user.service.js"
import { UserScalarFieldEnum } from "../generated/prisma/internal/prismaNamespace.js";

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

export async function createUserController(
    req: Request,
    res: Response
) {
    try {
        const data = createUserSchema.parse(req.body);

        const user = await createUser(data);    //Oobjeto enviado para service

        return res.status(201).json(user);
    } catch (error) {
        if(error instanceof z.ZodError) {
            return res.status(400).json({
                massage: "Dados inválidos",
                errors: error.issues
            });
        }

        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
}

export function getMeController(req: Request, res: Response) {
    return res.json({
        userId: req.user?.userId,
        role: req.user?.role
    })
}