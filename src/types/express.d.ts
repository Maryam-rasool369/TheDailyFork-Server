import { User, Role, Blog } from "../comman/types";

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