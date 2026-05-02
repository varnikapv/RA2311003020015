import type { Metadata } from "next";
import type { ReactNode } from "react";
import EmotionRegistry from "./providers/emotion-registry";

export const metadata: Metadata = {
  title: "Priority Inbox",
  description: "Campus notification priority inbox",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <EmotionRegistry>{children}</EmotionRegistry>
      </body>
    </html>
  );
}
