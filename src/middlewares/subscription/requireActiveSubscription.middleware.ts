import { Request, Response, NextFunction } from "express";
import { hasActiveSubscription } from "../../services/subscription/subscription.service";
import { PaymentRequiredError } from "../../utils/errors";

// Use AFTER authValidation on POST /blogs — req.body.currentUser must exist.
export const requireActiveSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUser = req.body.currentUser!;

        const active = await hasActiveSubscription(currentUser.id);

        if (!active) {
            throw new PaymentRequiredError(
                "An active subscription is required to create blogs"
            );
        }

        next();
    } catch (err) {
        next(err);
    }
};