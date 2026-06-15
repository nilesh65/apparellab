import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";

const AppLayout = () => {
  return (
    <SidebarProvider className="min-h-screen" defaultOpen={false}>
      <AppSidebar />
      <main className="w-full min-w-0 flex flex-col min-h-screen">
        <Header />
<div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>

    </SidebarProvider>
  );
};

export default AppLayout;


