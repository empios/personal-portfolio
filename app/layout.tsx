import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paweł Włodarczyk",
  description:
    "Paweł Włodarczyk — full-stack engineer. Backend developer at TME working across TypeScript, Node.js, PostgreSQL and AI features with LangGraph, LangChain, and Ollama.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('pw-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
