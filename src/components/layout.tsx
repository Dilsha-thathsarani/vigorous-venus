import React from "react";
import Sidebar from "./Sidebar";

// components/Layout.tsx
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-64 fixed left-0 top-0 h-full bg-white border-r z-10">
        <Sidebar />
      </div>

      {/* Main Content - adjusted margin to account for sidebar */}
      <main className="ml-64 flex-1 relative">{children}</main>
    </div>
  );
};

export default Layout;
