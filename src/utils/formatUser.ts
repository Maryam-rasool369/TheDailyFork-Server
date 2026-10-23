import { User } from "../comman/types"; // this was causing issue what the gender was not same so i changed it back to "../generated/client"


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
