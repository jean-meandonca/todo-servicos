import bcrypt from "bcryptjs"
import {prisma} from "../lib/prisma.js"

interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

export async function createUser(data: CreateUserData) {
    const email = data.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if(existingUser){
        throw new Error("E-mail já cadastrado");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
        data: {
            name: data.name,
            email,
            password: passwordHash
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        }
    })
};
