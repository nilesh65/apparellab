import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { LayoutDashboard, Wrench, List, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import Logo from "./logo"


const AppSidebar = () => {
    const {state} = useSidebar()
    const items = [
        {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
        },
        {
          title: "Listings",
          url: "/listings",
          icon: List
        },
         {
          title: "Orders",
          url: "/orders",
          icon: ShoppingBag
        },
        {
            title: "Settings",
            url: "/account/settings",
            icon: Wrench,
        },
    ]
    return (
        <Sidebar collapsible="icon" >
            <SidebarHeader >
               <div className="pt-2 px-1">
                 <Logo isCollapsed={state === "collapsed"} />
               </div>
            </SidebarHeader>
            <SidebarContent  >
                <SidebarGroup>
                    <SidebarGroupContent className="px-1 list-none!">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}
                            >
                                <SidebarMenuButton
                                    size="lg"
                                    className="text-base hover:bg-secondary"
                                    isActive={item.url === location.pathname}
                                    asChild>
                                    <Link to={item.url}>
                                        <item.icon className="size-6! stroke-1!" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}


export default AppSidebar