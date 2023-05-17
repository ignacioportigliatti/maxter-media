import { Sidebar } from "./components/Sidebar";
import './globals.css'

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <div className="hidden lg:flex">
            <Sidebar />
          </div>
          <div className="lg:h-screen flex w-full">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
