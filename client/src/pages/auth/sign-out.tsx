import Logo from "@/components/logo"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { AUTH_ROUTES } from "@/routes/routes"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function SignOutPage() {
  const navigate = useNavigate()

  const { mutateAsync: signOut, isPending } = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => {
      navigate(AUTH_ROUTES.SIGN_IN)
    }
  })

  useEffect(() => {
    signOut()
  }, [signOut])

  return (
    <main className="container h-screen mx-auto flex grow flex-col items-center
     justify-center gap-3">
      <div className="flex items-center gap-2">
        <Logo className="text-2xl" />
      </div>

      {isPending ? (
        <div className="flex items-center gap-2">
          <Spinner />
          <p>Signing Out...</p>
        </div>
      ) : (
        <p>SignedOut</p>
      )}

    </main>
  )
}
