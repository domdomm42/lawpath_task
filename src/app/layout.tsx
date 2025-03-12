import type { Metadata } from "next";

import "./globals.css";
import { ApolloProvider } from "@/components/ApolloProvider";

export const metadata: Metadata = {
  title: "Address Validation",
  description: "Address Validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
