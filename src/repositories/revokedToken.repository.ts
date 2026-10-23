import { prisma } from "../config/db";
import { hashToken } from "../utils/tokenHash";

export const revokeToken = async (token: string, expiresAt: Date) => {
    return prisma.revokedToken.upsert({
        where: { tokenHash: hashToken(token) },
        update: {},
        create: { tokenHash: hashToken(token), expiresAt },
    });
};

export const isTokenRevoked = async (token: string): Promise<boolean> => {
    const revokedId = await prisma.revokedToken.findUnique({
        where: { tokenHash: hashToken(token) },
        select: { id: true },
    })

    return revokedId !== null;
};

// An expired token is rejected by JWT verification anyway, so its row is no longer needed
export const deleteExpiredRevokedTokens = async () => {
    return prisma.revokedToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });
};
