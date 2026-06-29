import { BlogPosts } from "@/components/posts";
import { generateOgImage } from "@/blog/og-image";
import { baseUrl } from "@/sitemap";

export async function generateMetadata() {
  await generateOgImage("Ajay Dandge", "home");
  return {
    openGraph: {
      images: [{ url: `${baseUrl}/og/home.png` }],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${baseUrl}/og/home.png`],
    },
  };
}

export default function Page() {
  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ajay Dandge",
            url: baseUrl,
            sameAs: ["https://github.com/nobleknightt"],
          }),
        }}
      />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Ajay Dandge
      </h1>
      <p className="mb-2">
        {`I'm a developer who loves to write code, build software, and solve problems. Though, sometimes those problems are tougher than they seem!.`}
      </p>
      <p className="mb-4">
        {`By the way, nice to see you here! Hope you're having a great day!`}
      </p>
      <p className="mb-6">
        {`You can also check out `}
        <a
          href="https://contests.ajaydandge.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          Contests
        </a>
        {`, a simple platform to track upcoming programming contests, and `}
        <a
          href="https://coderun.ajaydandge.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          CodeRun
        </a>
        {`, an online code runner to quickly write, run, and test code.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
