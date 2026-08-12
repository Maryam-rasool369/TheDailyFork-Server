import { User, Role, Blog } from "../generated/client";

type UserWithRole = User & { role: Role };

declare global {
    namespace Express {
        interface Request {
            existingUser?: User;
            currentUser?: UserWithRole;
            blog?: Blog;
        }
    }
}

export {};