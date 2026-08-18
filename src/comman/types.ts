export type CreateUserInput = {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    roleId: number;
};