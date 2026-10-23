import { DigestBlog, DigestEmailJobData } from "../comman/types";
import { findBlogsPendingDigest, markBlogsNotified } from "../repositories/blog.repository";
import { findVerifiedUsersForDigest } from "../repositories/user.repository";
import { blogDigestQueue, JOB_NAMES } from "../queues/blogDigest.queue";
import { blogDigestTemplate } from "../templates/blog.template";
import { sendEmail } from "./email.service";

// Runs once a day: queues one email job per verified user, then marks the blogs as sent
export const queueBlogDigest = async () => {
    const blogs = await findBlogsPendingDigest();
    if (blogs.length === 0) return;

    const users = await findVerifiedUsersForDigest();
    if (users.length === 0) return;
    // Array of blog objects to be sent in the email
    const digestBlogs: DigestBlog[] = blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        shortDescription: blog.shortDescription,
        categoryName: blog.category.name,
    }));

    // Same job id for the same user on the same day, so a retried run can't queue duplicates
    const runDate = new Date().toISOString().slice(0, 10); //converts into UTC time zone and slice will give only the date part in YYYY-MM-DD format

    await blogDigestQueue.addBulk(
        users.map((user) => ({
            name: JOB_NAMES.SEND_DIGEST_EMAIL,
            //this data will be passed to the worker
            data: {
                to: user.email,
                firstName: user.firstName,
                blogs: digestBlogs,
            } satisfies DigestEmailJobData,
            opts: { jobId: `digest-${runDate}-${user.id}` },
        }))
    );

    await markBlogsNotified(blogs.map((blog) => blog.id));
};

export const sendBlogDigestEmail = async ({ to, firstName, blogs }: DigestEmailJobData) => {
    const subject =
        blogs.length === 1
            ? "1 new blog on Scribbly"
            : `${blogs.length} new blogs on Scribbly`;

    await sendEmail(to, subject, blogDigestTemplate(firstName, blogs));
};
