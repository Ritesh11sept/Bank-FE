import Navbar from "./navbar";
import Sidebar from "./Sidebar";
import BaseLayout from "./BaseLayout";

const DashboardLayout = ({ children }) => {
  return (
    <BaseLayout>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <Sidebar />
        <main className="flex-grow pt-16 sm:pl-60 min-h-screen overflow-auto w-full sm:w-[calc(100%-240px)]">
          {children}
        </main>
      </div>
    </BaseLayout>
  );
};

export default DashboardLayout;
