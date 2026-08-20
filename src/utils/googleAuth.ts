import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";
import { GoogleUserPayload } from "../comman/types";
import { BadRequestError } from "./errors";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string): Promise<GoogleUserPayload> => {
    let ticket;

    try {
        ticket = await client.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID,
        });
    } catch (err) {
        throw new BadRequestError("Invalid Google token");
    }

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
        throw new BadRequestError("Invalid Google token payload");
    }

    return {
        googleId: payload.sub,
        email: payload.email,
        firstName: payload.given_name ?? payload.name ?? "User",
        lastName: payload.family_name,
        profileImage: payload.picture,
    };
};
