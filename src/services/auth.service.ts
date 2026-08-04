import bycrpt from "bcrypt";
import { prisma } from "../config/db";
import jwt from "jsonwebtoken";
import { env } from '../config/env'

export const signup = async (data: any) => {
    // const { firstName, lastName, email, password } = data;
    const { firstName, lastName, email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bycrpt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword
        }
    })

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,

    }
}

export const login = async (data: any) => {

    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {

        throw new Error("User not found");

    }

    const isPasswordValid = await bycrpt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid Password")
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        env.JWT_SECRET as string,
        { expiresIn: "7d" }
    )

    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

    }
}
