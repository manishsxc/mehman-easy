import { Sora, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AppShell from "@/components/AppShell";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });
const script = Dancing_Script({ subsets: ["latin"], variable: "--font-script", weight: ["600", "700"] });

export const metadata = {
  title: "MahmaanEasy- Find your Dream",
  description:
    "Buy, sell, and discover properties near you. EV connects sellers and buyers directly, wherever the journey takes you.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${inter.variable} ${script.variable} font-body bg-ink text-cream antialiased`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
