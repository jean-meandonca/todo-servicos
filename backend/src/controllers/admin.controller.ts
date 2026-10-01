import type {Request, Response} from "express";
import {prisma} from "../lib/prisma.js"

export async function blockUserController(req: Request, res: Response) {
    const userId = Number(req.params.id);

    if(isNaN(userId)) {
        return res.status(400).json({
            message: "ID de usuário inválido"
        })
    }

    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if(!user){
        return res.status(400).json({
            message: "Usuário não encontrado"
        });
    }

    const blockedUser = await prisma.user.update({
        where: { id: userId},
        data: {
            status: "BLOCKED"
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    });

    return res.json(blockedUser)
}
