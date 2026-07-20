import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rigor Fulgor | Réparation de jantes en France",
  description:
    "Réparation et polissage de jantes, chromage de pièces et restauration de sellerie automobile en France.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}