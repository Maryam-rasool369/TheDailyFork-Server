import { z } from "zod";
import { passwordSchema } from "./common.validation";

export const updateProfileSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required").max(50).optional(),
    lastName: z.string().trim().max(50).optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    birthday: z.coerce.date().optional(),
    phoneNumber: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
        .optional(),
    bio: z.string().trim().max(300, "Bio must be under 300 characters").optional(),
});

export const verifyPasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: passwordSchema,
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type VerifyPasswordInput = z.infer<typeof verifyPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;