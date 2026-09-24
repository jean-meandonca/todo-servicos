import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {prisma} from '../lib/prisma.js'
import { error } from "console";

interface LoginData {
    email: string;
    password: string;
}

export async function login(data: LoginData) {
    const user = await prisma.user.findUnique({
        where: {email: data.email.toLocaleLowerCase().trim()}
    });

    if(!user || user.status === "BLOCKED") {
        throw new Error("E-mail ou senha inválidos")
    }

    const passwordMatches = await bcrypt.compare(
        data.password,
        user.password
    )

    if (!passwordMatches) {
        throw new Error("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}