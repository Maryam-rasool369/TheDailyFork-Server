import { prisma } from "../config/db";
import { UpsertSubscriptionInput } from "../comman/types";

export const findSubscriptionByUserId = async (userId: number) => {
    return prisma.subscription.findUnique({
        where: { userId },
    });
};

export const upsertSubscription = async (data: UpsertSubscriptionInput) => {
    return prisma.subscription.upsert({
        where: { userId: data.userId },
        create: { ...data },
        update: {
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripePriceId: data.stripePriceId,
            status: data.status,
            plan: data.plan,
            currentPeriodEnd: data.currentPeriodEnd,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        },
    });
};