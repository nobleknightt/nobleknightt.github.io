import { getBlogPosts } from "app/blog/utils";

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug + ".md" }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const postSlug = slug.replace(/\.md$/, "");
  const post = getBlogPosts().find((p) => p.slug === postSlug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const raw = `---\ntitle: "${post.metadata.title}"\npublishedAt: "${post.metadata.publishedAt}"\nsummary: "${post.metadata.summary}"\n---\n\n${post.content}`;

  return new Response(raw);
}
