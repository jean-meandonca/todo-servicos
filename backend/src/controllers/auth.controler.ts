import type {Request, Response} from "express";
import {z} from "zod";
import {login} from "../services/auth.service.js";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

export async function loginController(req: Request, res: Response) {
    try {
        const data = loginSchema.parse(req.body);
        const result = await login(data);

        return res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: error.issues
            });
        }

        if(error instanceof Error){
            return res.status(401).json({
                message: error.message
            })
        }
    }
}