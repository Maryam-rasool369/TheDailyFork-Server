import { prisma } from "../config/db";
import { SubscriptionPlan } from "../comman/enum";

export const updateStripeSessionIdForUser = async (userId: number, plan: SubscriptionPlan, sessionId: string) => {
    if (plan === SubscriptionPlan.MONTHLY) {
        await prisma.user.update({
            where: { id: userId },
            data: { pendingMonthlyCheckoutSessionId: sessionId },
        });
    }
    else {
        await prisma.user.update({
            where: { id: userId },
            data: { pendingYearlyCheckoutSessionId: sessionId },
        });
    }
}

export const markWebhookEventProcessed = async (eventId: string,eventType: string ) => {
    await prisma.processedWebhookEvent.create({
        data: {
            eventId,
            eventType
        }
    });
    return true;
}
