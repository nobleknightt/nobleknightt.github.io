import { getBlogPosts } from "@/blog/utils";
import { baseUrl } from "@/sitemap";

export const dynamic = "force-static";

export async function GET() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  const lines = [
    `# Ajay Dandge`,
    ``,
    `> Personal blog about software engineering, tools, and building things.`,
    ``,
    `## Blog Posts`,
    ``,
    ...posts.map(
      (post) =>
        `- [${post.metadata.title}](${baseUrl}/blog/${post.slug}.md): ${post.metadata.summary}`
    ),
  ].join("\n");

  return new Response(lines, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
