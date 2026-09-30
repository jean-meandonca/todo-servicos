import bcrypt from "bcryptjs"
import {prisma} from "../lib/prisma.js"

interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

interface UpdateUserData {
    name?: string | undefined;
    email?:string | undefined;
    password?: string | undefined;
}

export async function createUser(data: CreateUserData) {        //objeto recebido do controller
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

export async function getUserById(userId: number) {
    return prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

export async function updateUser(userId: number, data: UpdateUserData){
    const updateData: {
        name?: string;
        email?: string;
        password?: string;
    } = {};

    if (data.name){
        updateData.name = data.name;
    }

    if (data.email){
        const email = data.email.toLocaleLowerCase().trim();

        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: {id:userId}
            }
        });

        if (existingUser){
            throw new Error("E-mail já cadastrado");
        }

        updateData.email = email;
    }

    if (data.password){
        updateData.password = await bcrypt.hash(data.password, 10);
    } 

    return prisma.user.update({
        where: {id: userId},
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
}