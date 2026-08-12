import { User } from "../generated/client";

declare global {
    namespace Express {
        interface Request {
            existingUser?: User;
        }
    }
}

export {};