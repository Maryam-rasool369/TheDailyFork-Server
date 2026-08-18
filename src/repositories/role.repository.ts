import { Role } from "../comman/enum";
import { prisma } from "../config/db";

export const getOrCreateRole = async (role:Role) => {
    return prisma.role.upsert({
        where: { name: role },
        update: {},
        create: { name: role },
    });
};