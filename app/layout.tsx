import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import { Navbar } from "@/components/nav";
import { Oneko } from "@/components/oneko";
import "@/global.css";
import { baseUrl } from "@/sitemap";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ajay Dandge — Software Developer",
    template: "%s — Ajay Dandge",
  },
  description:
    "Developer blog covering software engineering, CLI tools, databases, authentication, and LLMs. Written by Ajay Dandge.",
  openGraph: {
    title: "Ajay Dandge — Software Developer",
    description:
      "Developer blog covering software engineering, CLI tools, databases, authentication, and LLMs. Written by Ajay Dandge.",
    url: baseUrl,
    siteName: "Ajay Dandge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ajay Dandge — Software Developer",
    description:
      "Developer blog covering software engineering, CLI tools, databases, authentication, and LLMs. Written by Ajay Dandge.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black",
        GeistSans.className
      )}
    >
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <Oneko />
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
      <GoogleAnalytics gaId="G-3V3L4N4VS7" />
    </html>
  );
}
