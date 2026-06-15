import { createAuthClient } from "better-auth/react"
import { ENV } from "./env"

export const authClient = createAuthClient({
  baseURL: ENV.BASE_API_URL
})
