import { UserButton } from "@daveyplate/better-auth-ui"
import { SidebarTrigger } from "./ui/sidebar"

const Header = () => {
  return (
    <div className="w-full h-12 shrink-0 bg-background">
      <div className="flex items-center pb-2 px-4 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>

        <UserButton size="icon"
          className="bg-sidebar!"

          classNames={{
            trigger: {
              user: {
                title: "text-black dark:text-white",
                subtitle: "text-muted-foreground"

              },
              avatar: {
                fallback: "bg-black! text-white!"
              }
            },
          }}

        />
      </div>
    </div>
  )
}

export default Header
