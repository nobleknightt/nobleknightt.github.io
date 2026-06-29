import { getBlogPosts } from "@/blog/utils";
import { baseUrl } from "@/sitemap";

export const dynamic = "force-static";

export async function GET() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  const sections = posts.map((post) =>
    [
      `# ${post.metadata.title}`,
      ``,
      `URL: ${baseUrl}/blog/${post.slug}`,
      `Published: ${post.metadata.publishedAt}`,
      ``,
      post.content,
    ].join("\n")
  );

  const body = sections.join("\n\n---\n\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
