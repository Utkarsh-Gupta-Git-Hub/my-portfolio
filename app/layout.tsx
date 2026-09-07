import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Utkarsh Gupta | Backend Developer",
  description: "Utkarsh Gupta is a backend developer and final-year computer science student from Prayagraj, working with Java, Spring Boot and distributed systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
