import Stripe from "stripe";
import { env } from "../../config/env";
import { prisma } from "../../config/db";
import { findUserById } from "../../repositories/user.repository";
import { upsertSubscription } from "../../repositories/subscription.repository";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { SubscriptionPlan } from "../../comman/enum";
import { hasActiveSubscription } from "./subscription.service";
import { updateStripeSessionIdForUser } from "../../repositories/stripeSession.repository";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-08-26.dahlia",
});

// Create these in Stripe Dashboard -> Product catalog -> one Product
// ("Blog Subscription") with two recurring Prices.
export const PRICE_IDS: Record<SubscriptionPlan, string> = { // PRICE_IDS is and object
    [SubscriptionPlan.MONTHLY]: env.STRIPE_PRICE_ID_MONTHLY!,
    [SubscriptionPlan.YEARLY]: env.STRIPE_PRICE_ID_YEARLY!,
};


export const getOrCreateStripeCustomer = async (userId: number, email: string) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    if (user.stripeCustomerId) {
        return user.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
        email,
        metadata: { userId: String(userId) },
    });

    await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
    });

    return customer.id;
};

export const createCheckoutSession = async (
    userId: number,
    email: string,
    plan: SubscriptionPlan
) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    if (!user.isVerified) {
        throw new BadRequestError("Please verify your email before subscribing.");
    }

    if (await hasActiveSubscription(userId)) {
        throw new BadRequestError("You already have an active subscription.");
    }


    if (plan === SubscriptionPlan.MONTHLY && user.pendingMonthlyCheckoutSessionId) {

        const existingMonthlySession = await stripe.checkout.sessions.retrieve(user.pendingMonthlyCheckoutSessionId);

        if (existingMonthlySession.status === "open" && existingMonthlySession.metadata?.plan === plan) {
            return existingMonthlySession;
        }
    }
    if (plan === SubscriptionPlan.YEARLY && user.pendingYearlyCheckoutSessionId) {

        const existingYearlySession = await stripe.checkout.sessions.retrieve(user.pendingYearlyCheckoutSessionId);

        if (existingYearlySession.status === "open" && existingYearlySession.metadata?.plan === plan) {
            return existingYearlySession;
        }
    }

    const customerId = await getOrCreateStripeCustomer(userId, email);

    const session = await stripe.checkout.sessions.create(
        {
            customer: customerId,
            mode: "subscription",
            line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
            success_url: `${env.FRONTEND_URL}/subscription/success`,
            cancel_url: `${env.FRONTEND_URL}/subscription/cancelled`,
            metadata: { userId: String(userId), plan },
            subscription_data: {
                metadata: { userId: String(userId), plan },
            },
        },
        {
            idempotencyKey: `checkout-session-${userId}-${plan}-${Math.floor(Date.now() / (2 * 60 * 1000))}`,
        }
    );
    await updateStripeSessionIdForUser(userId, plan, session.id);
    return session;
};

export const createPortalSession = async (userId: number) => {
    const user = await findUserById(userId);

    if (!user?.stripeCustomerId) {
        throw new BadRequestError("No billing account found for this user yet");
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${env.FRONTEND_URL}/account`,
    });

    return session;
};

/**
 * Upserts the local Subscription row from a Stripe subscription object.
 * Called from the webhook handler on create/update/delete events.
 */
export const syncSubscriptionFromStripe = async (subscription: Stripe.Subscription) => {
    const userIdStr = subscription.metadata?.userId;

    if (!userIdStr) {
        console.warn("Stripe subscription missing userId metadata:", subscription.id);
        return;
    }

    const item = subscription.items.data[0];

    if (!item) {
        console.warn("Stripe subscription has no items:", subscription.id);
        return;
    }

    // it start form 1 JAN 1979 and it is in seconds but JS date is in milliseconds so we need to multiply it by 1000 to convert it into milliseconds
    const currentPeriodEndUnix = item.current_period_end;

    const userId = Number(userIdStr);
    const price = item.price;
    const plan: SubscriptionPlan =
        (subscription.metadata?.plan as SubscriptionPlan | undefined) ??
        (price?.recurring?.interval === "year" ? SubscriptionPlan.YEARLY : SubscriptionPlan.MONTHLY);

    // Stripe expresses a pending cancellation two ways: the classic
    // cancel_at_period_end boolean, or a scheduled cancel_at timestamp
    // (used by newer portal configurations) — both mean "will cancel".
    const cancelAtPeriodEnd = subscription.cancel_at_period_end || subscription.canceled_at != null;

    await upsertSubscription({
        userId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: price?.id ?? "",
        status: subscription.status,
        plan,
        currentPeriodEnd: new Date(currentPeriodEndUnix * 1000),
        cancelAtPeriodEnd,
    });
};