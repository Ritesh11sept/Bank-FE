import { useState } from "react";
import BaseLayout from "./BaseLayout";
import Sidebar from "./Sidebar";
import Navbar from "./navbar";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  console.log("DashboardLayout rendering, mobileOpen:", mobileOpen);
  
  // We don't need this function anymore since we're using setMobileOpen directly
  // const toggleSidebar = () => {
  //   console.log("DashboardLayout: Toggling sidebar directly");
  //   setMobileOpen(!mobileOpen);
  // };

  return (
    <BaseLayout>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="flex-grow lg:ml-64 min-h-screen w-full">
          {/* Only pass the setMobileOpen function */}
          <Navbar setMobileOpen={setMobileOpen} />
          <div className="p-4 md:p-6 mt-16">
            {children}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default DashboardLayout;
