import { getBlogById } from "../blog.service";
import { hasActiveSubscription } from "../subscription/subscription.service";
import { findBlogRead, createBlogRead, countBlogReads } from "../../repositories/blogread.repository";
import { FREE_READ_LIMIT } from "../../comman/constants";
import { AccessLevel, BlogViewerResponse, User } from "../../comman/types";
import { truncateContent } from "../../utils/truncateContent";


export const getBlogForViewer = async (blogId: number, currentUser?: User)=> {
    const blog = await getBlogById(blogId); // throws NotFoundError if missing

    // Not logged in -> truncated preview, frontend shows the login prompt
    if (!currentUser) {
        return {
            ...blog,
            content: truncateContent(blog.content),
            access: "preview" as AccessLevel,
            requiresLogin: true,
            requiresPayment: false,
        };
    }

    // Active subscriber -> unlimited full access
    if (await hasActiveSubscription(currentUser.id)) {
        return {
            ...blog,
            access: "full" as AccessLevel,
            requiresLogin: false,
            requiresPayment: false,
        };
    }

    // Free logged-in user: re-reading something already "spent" is free
    const alreadyRead = await findBlogRead(currentUser.id, blogId);
    if (alreadyRead) {
        return {
            ...blog,
            access: "full" as AccessLevel,
            requiresLogin: false,
            requiresPayment: false,
        };
    }

    const readCount = await countBlogReads(currentUser.id);

    if (readCount < FREE_READ_LIMIT) {
        await createBlogRead(currentUser.id, blogId);
        return {
            ...blog,
            access: "full" as AccessLevel,
            requiresLogin: false,
            requiresPayment: false,
        };
    }

    // Free reads exhausted -> blurred content + paywall
    return {
        ...blog,
        content: truncateContent(blog.content),
        access: "paywalled" as AccessLevel,
        requiresLogin: false,
        requiresPayment: true,
    };
};