import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../comman/constants";
import { UnauthorizedError } from "./errors";

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = (
    password: string,
    hashedPassword: string
) => {
    return bcrypt.compare(password, hashedPassword);
};

export const validatePassword = async (password: string , hashedPassword: string) => {
    const isValid = await comparePassword(password, hashedPassword);

    if (!isValid) {
        throw new UnauthorizedError("Invalid email or password");
    }
};