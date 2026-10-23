import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import {
    stripe,
    createCheckoutSession,
    createPortalSession,
    syncSubscriptionFromStripe,
} from "../services/subscription/stripe.service";
import { getSubscriptionForUser, hasActiveSubscription } from "../services/subscription/subscription.service";
import { env } from "../config/env";
import { BadRequestError } from "../utils/errors";
import { SubscriptionPlan } from "../comman/enum";
import { markWebhookEventProcessed } from "../repositories/stripeSession.repository";

export const createCheckoutSessionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUser = req.body.currentUser!;
        const { plan } = req.body as { plan: SubscriptionPlan };

        if (!Object.values(SubscriptionPlan).includes(plan)) {
            throw new BadRequestError(
                `plan must be one of: ${Object.values(SubscriptionPlan).join(", ")}`
            );
        }

        const session = await createCheckoutSession(currentUser.id, currentUser.email, plan);

        return res.status(200).json({
            success: true,
            data: { url: session.url },
        });
    } catch (error) {
        next(error);
    }
};

export const createPortalSessionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUser = req.body.currentUser!;
        const session = await createPortalSession(currentUser.id);

        return res.status(200).json({
            success: true,
            data: { url: session.url },
        });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUser = req.body.currentUser!;
        const [subscription, isActive] = await Promise.all([ //both execute concurrently
            getSubscriptionForUser(currentUser.id),
            hasActiveSubscription(currentUser.id),
        ]);

        return res.status(200).json({
            success: true,
            data: { isActive, subscription },
        });
    } catch (error) {
        next(error);
    }
};

// POST /stripe/webhook
// IMPORTANT: this route must receive the RAW body, not JSON-parsed —

//this called after we have done somthing in stripe dashboard like payment success or subscription created or updated or deleted etc. stripe will send a webhook or make a POST request to this endpoint and we will handle it here
export const stripeWebhookController = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    const isNew = await markWebhookEventProcessed(event.id,event.type); //mark the webhook event as processed in the database, so that we don't process it again if stripe sends it again

    if (!isNew) {
        return res.status(200).json({ received: true });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.subscription) { // this will be the sub_id123
                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription as string
                    );
                    await syncSubscriptionFromStripe(subscription);
                }
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                await syncSubscriptionFromStripe(event.data.object as Stripe.Subscription);
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                console.warn("Payment failed for customer:", invoice.customer);
                break;
            }

            default:
                break; // unhandled event types are fine to ignore
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Error processing webhook event:", error);
        // 500 tells Stripe to retry the event later
        return res.status(500).json({ error: "Webhook handler failed" });
    }
};