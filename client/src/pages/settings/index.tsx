import { AccountView } from "@daveyplate/better-auth-ui"
import { useLocation } from "react-router-dom"


export default function SettingPage() {
  const { pathname } = useLocation()

  return (
    <main className="container p-4 md:p-6">
      <AccountView pathname={pathname} />
    </main>
  )
}
