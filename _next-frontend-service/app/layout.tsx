import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ProtectedRoutes from "@/providers/ProtectedRoutes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "Chat platform for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} relative`}>
        <ReactQueryProvider>
          <ThemeProvider attribute='class' defaultTheme='light'>
            {/* <div className="w-fullh-full flex justify-center"> */}
            {/* <Navbar /> */}
            {/* </div> */}
            <ProtectedRoutes>
              {children}
            </ProtectedRoutes>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html >
  );
}
