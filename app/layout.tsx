import type { Metadata } from "next";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "Second Cursor: Moving Day",
  description: "One workspace. Two cursors. Arrange a room side by side with an AI agent through WebMCP.",
  openGraph: {
    title: "Second Cursor: Moving Day",
    description: "One workspace. Two cursors. A WebMCP collaboration experiment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Second Cursor: Moving Day",
    description: "One workspace. Two cursors. A WebMCP collaboration experiment.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
