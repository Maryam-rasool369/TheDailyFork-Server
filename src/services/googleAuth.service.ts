import * as userRepository from "../repositories/user.repository";
import { getOrCreateRole } from "../repositories/role.repository";
import { toPublicUser } from "../utils/formatUser";
import { AuthProvider, Role } from "../comman/enum";
import { User } from "../comman/types";
import { verifyGoogleToken } from "../utils/googleAuth";



export const googleLogin = async (idToken: string) => {
    const googleUser = await verifyGoogleToken(idToken);

    // Case 1: already signed up with Google before
    let user = await userRepository.findUserByGoogleId(googleUser.googleId);

    if (!user) {
        // Case 2: email already exists (signed up normally before) — link accounts
        const existingUser = await userRepository.findUserByEmail(googleUser.email);

        if (existingUser) {
            user = await userRepository.linkGoogleAccount(existingUser.id, googleUser.googleId);
        } else {
            // Case 3: brand new user — create via Google
            const role = await getOrCreateRole(Role.USER);

            user = await userRepository.createGoogleUser({
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                email: googleUser.email,
                googleId: googleUser.googleId,
                profileImage: googleUser.profileImage,
                roleId: role.id,
                authProvider: AuthProvider.GOOGLE,
            });
        }
    }

    return toPublicUser(user as User);
};