import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Subham Das | BMLT Portfolio",
  description:
    "Personal portfolio of Subham Das — Bachelor of Medical Laboratory Technology (BMLT) student, 3rd year. Showcasing certificates, workshops, and clinical lab skills.",
  keywords: [
    "BMLT",
    "Medical Laboratory Technology",
    "Subham Das",
    "Clinical Lab",
    "Portfolio",
  ],
  openGraph: {
    title: "Subham Das | BMLT Portfolio",
    description:
      "BMLT Student | Future Medical Lab Technologist",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(0,119,182,0.2)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
