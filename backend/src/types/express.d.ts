import { getAuth } from "../lib/auth"

type AuthSession = ReturnType<typeof getAuth>['$Infer']['Session'];

declare global {
  namespace Express {
    interface Request {
      user: AuthSession['user'];
      session: AuthSession
    }
  }
}
