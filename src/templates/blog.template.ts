import { env } from "../config/env";
import { DigestBlog } from "../comman/types";
import { escapeHtml } from "../utils/escapeHtml";
// import { escapeHtml } from "../utils/escapeHtml";

export const blogDigestTemplate = (firstName: string, blogs: DigestBlog[]) => {
  const items = blogs
    .map(
      (blog) => `
        <div>
          <p>${escapeHtml(blog.categoryName)}</p>

          <h3>${escapeHtml(blog.title)}</h3>

          <p>${escapeHtml(blog.shortDescription)}</p>

          <a href="${escapeHtml(env.FRONTEND_URL)}/blog/${blog.id}">
            Read more
          </a>
        </div>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Hi ${escapeHtml(firstName)}, here's what's new on Scribbly</h2>

        <p>
          ${blogs.length === 1 ? "A new blog was" : `${blogs.length} new blogs were`} published today:
        </p>

        ${items}
      </body>
    </html>
  `;
};
