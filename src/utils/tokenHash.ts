import { createHash } from "crypto";

// We store a hash of revoked tokens, not the tokens themselves,
// so a leaked database can't be used to hijack a still-valid session.
export const hashToken = (token: string) => {
    return createHash("sha256").update(token).digest("hex");
};
