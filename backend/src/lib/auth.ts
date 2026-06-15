import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins"
import { jwt } from "better-auth/plugins"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { Env } from "../config/env.config";
import { compareValue, hashValue } from "../utils/bcrypt";

export const getAuth = () => {
  if (!mongoose.connection.db) {
    throw new Error("Database connection established. Call connectDatabase() first.");
  }
  return betterAuth({
    baseURL: Env.BETTER_AUTH_URL,
    secret: Env.BETTER_AUTH_SECRET,
    trustedOrigins: [Env.FRONTEND_ORIGIN],
    database: mongodbAdapter(mongoose.connection.db, {
      client: mongoose.connection.getClient()
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      password: {
        hash: hashValue,
        verify: compareValue
      },
    },
    socialProviders: {
      google: {
        clientId: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET
      }
    },
    advanced: {
      database: {
        generateId: false //_id
      },
      cookiePrefix: "mer-ai",
      cookies: {
        session_token: {
          name: "ApparelLab_session_token",
        },
      }
    },
    plugins: [
      openAPI(),
      jwt()
    ]
  });
}
