import { updateUserPassword } from "../repositories/user.repository";
import { hashPassword } from "../utils/password";

export const setNewPassword = async (userId: number, newPassword: string) => {
    const hashedPassword = await hashPassword(newPassword);
    await updateUserPassword(userId, hashedPassword);
};