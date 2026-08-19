import { User } from "../generated/client";

// this builds a new smaller object 
export const toPublicUser = (user: User) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        gender: user.gender,
        birthday: user.birthday,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
    };
};