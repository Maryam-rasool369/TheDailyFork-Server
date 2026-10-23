import { Router, raw } from "express";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import {
    createCheckoutSessionController,
    createPortalSessionController,
    getSubscriptionStatusController,
    stripeWebhookController,
} from "../controllers/stripe.controller";

const router = Router();

router.post("/webhook", raw({ type: "application/json" }), stripeWebhookController); //only stripe can send a webhook to this endpoint, so no authValidation is needed
router.post("/create-checkout-session", authValidation, createCheckoutSessionController);
router.post("/create-portal-session", authValidation, createPortalSessionController);
router.get("/status", authValidation, getSubscriptionStatusController);

export default router;
