import { Role } from "../comman/enum";
import { prisma } from "../config/db";

export const getUserRole = async () => {
    return prisma.role.upsert({
        where: { name: Role.USER },
        update: {},
        create: { name: Role.USER },
    });
};