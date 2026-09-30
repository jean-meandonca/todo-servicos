import type {Request, Response} from "express";
import {z} from "zod";
import {createUser, getUserById, updateUser} from "../services/user.service.js"

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional()
})

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

export async function getMeController(req: Request, res: Response) {
    const user = await getUserById(req.user!.userId)

    if(!user) {
        return res.status(404).json({
            message: "Usuário não encontrado"
        });
    }

    return res.json(user);
}

export async function updateMeController(req: Request, res: Response) {
    try {
        const data = updateUserSchema.parse(req.body);          //os dados que chegam, verificado o padrão pelo zod

        const user = await updateUser(req.user!.userId, data);

        return res.json(user);
    } catch (error){
        if(error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: error.issues
            });
        }

        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Erro interno do servidor"
        })
    }
}