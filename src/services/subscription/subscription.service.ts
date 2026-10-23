import { ACTIVE_STATUSES } from "../../comman/constants";
import { findSubscriptionByUserId } from "../../repositories/subscription.repository";


export const hasActiveSubscription = async (userId: number): Promise<boolean> => {
    const subscription = await findSubscriptionByUserId(userId);

    if (!subscription) return false;

    return (
        // return true of false
        ACTIVE_STATUSES.includes(subscription.status) &&
        subscription.currentPeriodEnd > new Date()
    );
};

export const getSubscriptionForUser = async (userId: number) => {
    return findSubscriptionByUserId(userId);
};