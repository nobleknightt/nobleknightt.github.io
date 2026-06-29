import fs from "fs/promises";
import path from "path";
import { getBlogPosts } from "@/blog/utils";

export async function generateBlogMarkdown(slug: string) {
  const post = getBlogPosts().find((p) => p.slug === slug);
  if (!post) return;

  const content = `---\ntitle: "${post.metadata.title}"\npublishedAt: "${post.metadata.publishedAt}"\nsummary: "${post.metadata.summary}"\n---\n\n${post.content}`;

  const outPath = path.join(process.cwd(), "public", "blog", `${slug}.md`);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, content);
}
