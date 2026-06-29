import { BlogPosts } from "@/components/posts";

export const metadata = {
  title: "Blog",
  description:
    "Technical posts on software engineering, databases, CLI tooling, authentication, and AI. Practical writing from real engineering problems.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  );
}
