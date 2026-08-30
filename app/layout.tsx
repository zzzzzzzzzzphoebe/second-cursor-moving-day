import type { Metadata } from "next";
import "../src/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://second-cursor-moving-day.zzzzzzzzzz-phoebe.chatgpt.site"),
  title: "Second Cursor: Moving Day",
  description: "One workspace. Two cursors. Arrange a room side by side with an AI agent through WebMCP.",
  openGraph: {
    title: "Second Cursor: Moving Day",
    description: "One workspace. Two cursors. A WebMCP collaboration experiment.",
    type: "website",
    images: [{
      url: "/og.png",
      width: 1730,
      height: 909,
      alt: "Second Cursor: Moving Day — One workspace. Two cursors.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Second Cursor: Moving Day",
    description: "One workspace. Two cursors. A WebMCP collaboration experiment.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
