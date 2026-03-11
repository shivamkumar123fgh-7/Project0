import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export const metadata = {
  title: "GrowthOS",
  description: "Premium Growth Tracking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#121212] text-white">

        <div className="relative min-h-screen overflow-hidden">

  {/* Background Layer */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] animate-gradient"></div>

  <div className="relative flex min-h-screen">

            <Sidebar />

            <div className="flex-1 flex flex-col">
             
              <div className="flex-1 p-8 overflow-x-auto">
  <div className="max-w-7xl mx-auto w-full">
    {children}
  </div>
</div>
            </div>

          </div>

        </div>

      </body>
    </html>
  );
}