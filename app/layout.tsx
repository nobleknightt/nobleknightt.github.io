import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Footer from "app/components/footer";
import { Navbar } from "app/components/nav";
import "app/global.css";
import { baseUrl } from "app/sitemap";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ajay Dandge",
    template: "%s | Ajay Dandge",
  },
  description: "Ajay Dandge's Blog",
  openGraph: {
    title: "Ajay Dandge",
    description: "Ajay Dandge's Blog",
    url: baseUrl,
    siteName: "Ajay Dandge",
    locale: "en_US",
    type: "website",
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
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
