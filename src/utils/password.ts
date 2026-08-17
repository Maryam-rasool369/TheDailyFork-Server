import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../comman/constants";

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = (
    password: string,
    hashedPassword: string
) => {
    return bcrypt.compare(password, hashedPassword);
};