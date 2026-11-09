import type { Metadata } from "next";
import "./globals.css";
import AnimatedBackground from "./components/AnimatedBackground";

export const metadata: Metadata = {
  title: "Karol Isabella Cabrera | Portafolio",
  description: "Portafolio personal de Karol Isabella Cabrera Pantoja, estudiante de ingeniería de software y ADSO.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="min-h-full flex flex-col">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
