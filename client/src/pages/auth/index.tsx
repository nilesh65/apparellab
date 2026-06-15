import Logo from "@/components/logo"

import { useLocation } from "react-router-dom"
import { AuthView } from "@daveyplate/better-auth-ui"


export default function AuthPage() {
  const { pathname } = useLocation()

  return (
    <main className="container h-screen mx-auto flex grow flex-col items-center
     justify-center gap-3">
      <div className="flex items-center gap-2">
        <Logo className="text-2xl" />
      </div>

      <AuthView pathname={pathname} />

    </main>
  )
}
